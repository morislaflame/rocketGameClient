import React, { useState } from 'react';
import { Case } from '@/types/types';
import { Button } from '@/components/ui/button';
import CasePurchaseButtons from './CasePurchaseButtons';
import styles from './CasesComponents.module.css';
import { useNavigate } from 'react-router-dom';
import UserCaseCount from './UserCaseCount';
import tonImg from "@/assets/TonIcon.svg";
import starImg from "@/assets/stars.svg";
import { getPlanetImg } from '@/utils/getPlanetImg';

interface CaseItemProps {
  caseItem: Case;
  onPurchaseSuccess: () => void;
}

const CaseItem: React.FC<CaseItemProps> = ({ caseItem, onPurchaseSuccess }) => {
  const navigate = useNavigate();
  const [userCaseCount, setUserCaseCount] = useState<number>(0);
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
              <div className='flex items-center gap-4'>
                {/* <span className='text-sm'>Price:</span> */}
                {renderPriceTag(tonImg, caseItem.price, 'TON')}
                {renderPriceTag(starImg, caseItem.starsPrice, 'Stars')}
                {renderPriceTag(planetImg, caseItem.pointsPrice, 'Points')}
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
        disabled={userCaseCount <= 0 && caseItem.type !== 'free'}
      >
        Open case
      </Button>
    </div>
  );
};

export default CaseItem; 