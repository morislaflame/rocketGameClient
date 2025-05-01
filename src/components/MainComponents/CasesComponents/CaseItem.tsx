import React, { useState } from 'react';
import { Case } from '@/types/types';
import { Button } from '@/components/ui/button';
import CasePurchaseButtons from './CasePurchaseButtons';
import styles from './CasesComponents.module.css';
import { useNavigate } from 'react-router-dom';
import UserCaseCount from './UserCaseCount';

interface CaseItemProps {
  caseItem: Case;
  onPurchaseSuccess: () => void;
}

const CaseItem: React.FC<CaseItemProps> = ({ caseItem, onPurchaseSuccess }) => {
  const navigate = useNavigate();
  const [userCaseCount, setUserCaseCount] = useState<number>(0);
  
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
        
      </div>
      {caseItem.type !== 'free' && (
      <div className={styles.casePurchaseButtons}>
        {/* Используем новый компонент для отображения количества кейсов */}
        <UserCaseCount 
          caseId={caseItem.id} 
          onCountChange={handleCountChange}
        />
        
        {/* Добавляем кнопки покупки */}
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
      )}
      
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