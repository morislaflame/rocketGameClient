import React, { useState, useEffect, useContext, useRef } from 'react';
import { Case } from '@/types/types';
import { Button } from '@/components/ui/button';
import styles from './CasesComponents.module.css';
import { useNavigate } from 'react-router-dom';
import UserCaseCount from './UserCaseCount';
import tonImg from "@/assets/TonIcon.svg";
import starImg from "@/assets/stars.svg";
import { getPlanetImg } from '@/utils/getPlanetImg';
import { BorderTrail } from '@/components/ui/border-trail';
import { Context, IStoreContext } from '@/store/StoreProvider';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface CaseItemProps {
  caseItem: Case;
}

const CaseItem: React.FC<CaseItemProps> = observer(({ caseItem }) => {
  const navigate = useNavigate();
  const [userCaseCount, setUserCaseCount] = useState<number>(0);
  const planetImg = getPlanetImg();
  const { cases } = useContext(Context) as IStoreContext;
  const [countdown, setCountdown] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslate();
  
  // Проверяем доступность бесплатного кейса
  useEffect(() => {
    if (caseItem.type === 'free') {
      // Сначала проверяем, есть ли уже сохраненное время доступности в сторе
      const storedTime = cases.nextAvailableAt[caseItem.id];
      
      if (storedTime) {
        const nextTime = new Date(storedTime);
        const now = new Date();
        
        // Если сохраненное время в будущем, используем его
        if (nextTime > now) {
          startCountdown(Math.floor((nextTime.getTime() - now.getTime()) / 1000));
          return; // Выходим из эффекта, не делая запрос
        }
      }
      
      // Если нет сохраненного времени или оно устарело, запрашиваем с сервера
      const checkAvailability = async () => {
        try {
          const availability = await cases.checkFreeCaseAvailability(caseItem.id);
          if (availability && !availability.isAvailable && availability.secondsUntilAvailable) {
            // Вычисляем точное время следующей доступности
            const nextTime = new Date();
            nextTime.setSeconds(nextTime.getSeconds() + availability.secondsUntilAvailable);
            
            // Сохраняем в store
            cases.setNextAvailableAt(caseItem.id, nextTime.toISOString());
            
            // Запускаем обратный отсчет
            startCountdown(availability.secondsUntilAvailable);
          }
        } catch (error) {
          console.error("Error checking free case availability:", error);
        }
      };
      
      checkAvailability();
    }
    
    // Очистка при размонтировании
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [caseItem.id, caseItem.type, cases]);
  
  // Функция для запуска обратного отсчета
  const startCountdown = (seconds: number) => {
    if (!seconds) return;
    
    // Очищаем предыдущий таймер, если он был
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    let remainingSeconds = seconds;
    
    // Текущее время + оставшиеся секунды = время доступности
    const nextAvailableTime = new Date();
    nextAvailableTime.setSeconds(nextAvailableTime.getSeconds() + remainingSeconds);
    
    const updateCountdown = () => {
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      const secs = remainingSeconds % 60;
      
      setCountdown(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      );
      
      if (remainingSeconds > 0) {
        remainingSeconds -= 1;
        
        // Обновляем время в сторе при каждом тике (опционально, можно реже)
        const updatedNextTime = new Date();
        updatedNextTime.setSeconds(updatedNextTime.getSeconds() + remainingSeconds);
        cases.setNextAvailableAt(caseItem.id, updatedNextTime.toISOString());
        
        timerRef.current = setTimeout(updateCountdown, 1000);
      } else {
        setCountdown(null);
        // Удаляем время из стора, когда таймер заканчивается
        cases.setNextAvailableAt(caseItem.id, null);
        // Сбрасываем флаг проверки, чтобы можно было проверить снова
        cases.resetFreeCaseCheck(caseItem.id);
      }
    };
    
    updateCountdown();
  };
  
  // Функция для отображения изображения кейса
  const renderCaseImage = (caseItem: Case) => {
    const imageUrl = caseItem.media_file?.url || caseItem.imageUrl || '/default-case-image.png';
    return <img src={imageUrl} alt={caseItem.name} className={styles.caseImage} />;
  };

  // Функция для перенаправления на страницу рулетки с ID кейса
  const handleOpenCase = () => {
    navigate(`/roulette/${caseItem.id}`);
  };

  // Обработчик изменения количества кейсов
  const handleCountChange = (count: number) => {
    setUserCaseCount(count);
  };

  // Компонент для отображения цены
  const renderPriceTag = (icon: string, price: string | number | undefined, label: string) => {
    if (!price || Number(price) <= 0) return null;
    
    // Форматируем цену в зависимости от типа валюты
    let formattedPrice = price;
    if (label === 'TON') {
      // Для TON отображаем с одним знаком после запятой
      formattedPrice = Number(price).toFixed(1);
    }
    
    return (
      <div className={styles.priceTag}>
         <span>{formattedPrice}</span>
          <img src={icon} alt={label} className={styles.priceIcon} />
      </div>
    );
  };

  // Компонент-разделитель между ценовыми тегами
  const Divider = () => (
    <div className={styles.priceDivider}></div>
  );

  // Функция для рендеринга ценовых тегов с разделителями между ними
  const renderPricesWithDividers = () => {
    const prices = [];
    
    // Добавляем TON цену если есть
    if (caseItem.price && Number(caseItem.price) > 0) {
      prices.push(
        renderPriceTag(tonImg, caseItem.price, 'TON')
      );
    }
    
    // Добавляем Stars цену если есть
    if (caseItem.starsPrice && caseItem.starsPrice > 0) {
      // Если уже есть элементы, добавляем разделитель перед
      if (prices.length > 0) {
        prices.push(<Divider key={`divider-stars`} />);
      }
      prices.push(
        renderPriceTag(starImg, caseItem.starsPrice, 'Stars')
      );
    }
    
    // Добавляем Points цену если есть
    if (caseItem.pointsPrice && caseItem.pointsPrice > 0) {
      // Если уже есть элементы, добавляем разделитель перед
      if (prices.length > 0) {
        prices.push(<Divider key={`divider-points`} />);
      }
      prices.push(
        renderPriceTag(planetImg, caseItem.pointsPrice, 'Points')
      );
    }
    
    return prices;
  };

  return (
    <div className='flex flex-col gap-2'>
      
      <div className={styles.caseCard}>
        {userCaseCount > 0 && (
          <BorderTrail
            style={{
              boxShadow: '0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)',
              zIndex: 1000
            }}
            size={300}
          />
        )}
        <div className={styles.caseImageContainer}>
          {renderCaseImage(caseItem)}
          
          {/* Таймер для бесплатного кейса */}
          {caseItem.type === 'free' && countdown && (
            <div className={styles.countdownOverlay}>
              <div className={styles.countdownTimer}>
                {countdown}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 p-2">
            <div className="text-md font-medium">
                {caseItem.name}
                <div className="text-sm text-muted-foreground">
                    {caseItem.description}
                </div>
            </div>
            
          <div className='flex justify-between'>
            {caseItem.type !== 'free' && (
              <div className={styles.priceContainer}>
                <div className='flex items-center'>
                  {renderPricesWithDividers()}
                </div>
              </div>
            )}
            <div className='flex w-fit justify-end'>
                <UserCaseCount 
                  caseId={caseItem.id} 
                  onCountChange={handleCountChange}
                />
            </div>
          </div>
        </div>
        
        <Button
          className={styles.openCaseButton}
          onClick={handleOpenCase}
          disabled={caseItem.type === 'free' && countdown !== null}
        >
          {caseItem.type === 'free' && countdown !== null ? t('not_available') : t('open_case')}
        </Button>
      </div>        
    </div>
  );
});

export default CaseItem; 