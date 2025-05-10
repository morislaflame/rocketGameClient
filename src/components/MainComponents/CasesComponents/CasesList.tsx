import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context, IStoreContext } from '@/store/StoreProvider';
import { Case } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';
import styles from './CasesComponents.module.css';
import { Button } from '@/components/ui/button';
import CaseItem from './CaseItem';

const CasesList: React.FC = observer(() => {
  const { cases } = useContext(Context) as IStoreContext;
  const [sortedCases, setSortedCases] = useState<Case[]>([]);

  useEffect(() => {
    // Загружаем кейсы только если список пуст и нет процесса загрузки
    if (cases.cases.length === 0 && !cases.loading) {
      cases.fetchCases();
    }
  }, [cases]);

  useEffect(() => {
    // Сортируем кейсы так, чтобы бесплатные были в начале
    if (cases.cases && cases.cases.length > 0) {
      setSortedCases([...cases.cases]);
    }
  }, [cases.cases]);

  // Группируем кейсы по типу
  const freeCases = sortedCases.filter(caseItem => caseItem.type === 'free');
  const standardCases = sortedCases.filter(caseItem => caseItem.type === 'standard');
  const authorCases = sortedCases.filter(caseItem => caseItem.type === 'author');

  // Отображение загрузки
  if (cases.loading) {
    return (
      <div className='flex flex-col gap-5 mt-3'>
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className={styles.caseCardSkeleton}>
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
        <p>Error loading: {cases.error}</p>
        <Button 
          variant="secondary" 
          className="mt-2" 
          onClick={() => cases.fetchCases()}
        >
          Repeat
        </Button>
      </div>
    );
  }

  // Отображение пустого списка
  if (sortedCases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <p className="text-gray-400">No cases found</p>
      </div>
    );
  }

  // Функция для отображения секции кейсов
  const renderCaseSection = (casesList: Case[]) => {
    if (casesList.length === 0) return null;
    
    return (
      <div className="mb-8">
        {/* <h2 className="text-xl font-bold mb-4">{title}</h2> */}
        <div className={styles.casesGrid}>
          {casesList.map((caseItem) => (
            <CaseItem
              key={caseItem.id}
              caseItem={caseItem}
            />
          ))}
        </div>
      </div>
    );
  };

  // Отображение списка кейсов по секциям
  return (
    <div className="space-y-8">
      {renderCaseSection(freeCases)}
      {renderCaseSection(standardCases)}
      {renderCaseSection(authorCases)}
    </div>
  );
});

export default CasesList;