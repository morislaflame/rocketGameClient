import React, { useContext } from 'react';
import { Case } from '@/types/types';
import { Button } from '@/components/ui/button';
import CasePurchaseButtons from './CasePurchaseButtons';
import styles from './CasesComponents.module.css';
import { Context, IStoreContext } from '@/store/StoreProvider';

interface CaseItemProps {
  caseItem: Case;
  onOpenCase: (caseId: number) => void;
  onPurchaseSuccess: () => void;
}

const CaseItem: React.FC<CaseItemProps> = ({ caseItem, onOpenCase, onPurchaseSuccess }) => {
  const { cases } = useContext(Context) as IStoreContext;
  
  // Функция для отображения изображения кейса
  const renderCaseImage = (caseItem: Case) => {
    const imageUrl = caseItem.media_file?.url || caseItem.imageUrl || '/default-case-image.png';
    return <img src={imageUrl} alt={caseItem.name} className={styles.caseImage} />;
  };

  // Получаем количество кейсов у пользователя
  const getUserCaseCount = () => {
    if (!cases.userCases || cases.userCases.length === 0) return 0;
    return cases.userCases.filter(userCase => userCase.caseId === caseItem.id).length;
  };

  const userCaseCount = getUserCaseCount();

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
        {userCaseCount > 0 && (
          <div className="text-sm text-green-500 font-medium">
            You have: {userCaseCount}
          </div>
        )}
        {/* Добавляем кнопки покупки */}
        
            <CasePurchaseButtons
            caseId={caseItem.id}
            price={caseItem.price?.toString() || ''}
            starsPrice={caseItem.starsPrice || 0}
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
        onClick={() => onOpenCase(caseItem.id)}
      >
        Open case
      </Button>
    </div>
  );
};

export default CaseItem; 