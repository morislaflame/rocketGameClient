import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context, IStoreContext } from '@/store/StoreProvider';
import { Case } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';
import styles from './CasesComponents.module.css';
import { Button } from '@/components/ui/button';

const CasesList: React.FC = observer(() => {
  const { cases } = useContext(Context) as IStoreContext;
  const [sortedCases, setSortedCases] = useState<Case[]>([]);

  useEffect(() => {
    // Загружаем все кейсы при монтировании компонента
    const loadCases = async () => {
      await cases.fetchCases();
    };
    
    loadCases();
  }, [cases]);

  useEffect(() => {
    // Сортируем кейсы так, чтобы бесплатные были в начале
    if (cases.cases && cases.cases.length > 0) {
      const freeCases = cases.cases.filter(caseItem => caseItem.type === 'free');
      const otherCases = cases.cases.filter(caseItem => caseItem.type !== 'free');
      
      setSortedCases([...freeCases, ...otherCases]);
    }
  }, [cases.cases]);

  // Функция для отображения цены кейса
  const renderCasePrice = (caseItem: Case) => {
    if (caseItem.type === 'free') {
      return <span className="text-green-500 font-semibold">Free</span>;
    }
    return <span className="text-white font-semibold">{caseItem.price} tokens</span>;
  };

  // Функция для отображения изображения кейса
  const renderCaseImage = (caseItem: Case) => {
    const imageUrl = caseItem.media_file?.url || caseItem.imageUrl || '/default-case-image.png';
    return <img src={imageUrl} alt={caseItem.name} className={styles.caseImage} />;
  };

  // Отображение загрузки
  if (cases.loading) {
    return (
      <div className={styles.casesList}>
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className={styles.caseCard}>
            <Skeleton className="w-full h-[150px] rounded-md" />
            <Skeleton className="w-3/4 h-[20px] mt-2" />
            <Skeleton className="w-1/2 h-[16px] mt-1" />
          </div>
        ))}
      </div>
    );
  }

  // Отображение ошибки
  if (cases.error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        <p>Ошибка загрузки: {cases.error}</p>
        <Button 
          variant="secondary" 
          className="mt-2" 
          onClick={() => cases.fetchCases()}
        >
          Повторить
        </Button>
      </div>
    );
  }

  // Отображение пустого списка
  if (sortedCases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <p className="text-gray-400">Кейсы не найдены</p>
      </div>
    );
  }

  // Отображение списка кейсов
  return (
    <div className={styles.casesGrid}>
      {sortedCases.map((caseItem) => (
        <div key={caseItem.id} className={styles.caseCard}>
          <div className={styles.caseImageContainer}>
            {renderCaseImage(caseItem)}
          </div>
          <div className="text-md font-medium mt-2">{caseItem.name}</div>
          <div className="text-sm mt-1">{renderCasePrice(caseItem)}</div>
          <Button 
            variant="secondary" 
            className={styles.openCaseButton}
            onClick={() => cases.fetchOneCase(caseItem.id)}
          >
            Открыть кейс
          </Button>
        </div>
      ))}
    </div>
  );
});

export default CasesList;