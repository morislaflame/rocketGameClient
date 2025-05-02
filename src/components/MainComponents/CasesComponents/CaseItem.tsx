import React, { useState } from 'react';
import { Case } from '@/types/types';
import { Button } from '@/components/ui/button';
import styles from './CasesComponents.module.css';
import { useNavigate } from 'react-router-dom';
import UserCaseCount from './UserCaseCount';
import tonImg from "@/assets/TonIcon.svg";
import starImg from "@/assets/stars.svg";
import { getPlanetImg } from '@/utils/getPlanetImg';

interface CaseItemProps {
  caseItem: Case;
}

const CaseItem: React.FC<CaseItemProps> = ({ caseItem }) => {
  const navigate = useNavigate();
  const [_userCaseCount, setUserCaseCount] = useState<number>(0);
  const planetImg = getPlanetImg();
  
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
    <div className={styles.caseCard}>
      <div className={styles.caseImageContainer}>
        {renderCaseImage(caseItem)}
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
      {/* {caseItem.type !== 'free' && (
        <div className={styles.casePurchaseButtons}>
          <UserCaseCount 
            caseId={caseItem.id} 
            onCountChange={handleCountChange}
          />
          
          <CasePurchaseButtons
            caseId={caseItem.id}
            price={caseItem.price?.toString() || ''}
            starsPrice={caseItem.starsPrice || 0}
            pointsPrice={caseItem.pointsPrice || 0}
            onPurchase={(success) => {
                if (success) {
                  onPurchaseSuccess();
                }
            }}
          />
        </div>
      )} */}
      
      <Button
        className={styles.openCaseButton}
        onClick={handleOpenCase}
      >
        Open case
      </Button>
    </div>
  );
};

export default CaseItem; 