import React, { useContext, useEffect, useState } from 'react';
import { Context, IStoreContext } from '@/store/StoreProvider';
import { Skeleton } from '@/components/ui/skeleton';
import styles from './CasesComponents.module.css';
import { observer } from 'mobx-react-lite';

interface UserCaseCountProps {
  caseId: number;
  onCountChange?: (count: number) => void;
}

const UserCaseCount: React.FC<UserCaseCountProps> = observer(({ caseId, onCountChange }) => {
  const { cases } = useContext(Context) as IStoreContext;
  const [count, setCount] = useState<number>(0);

  // Функция для получения количества кейсов конкретного типа у пользователя
  const getUserCaseCount = (): number => {
    if (!cases.userCases || cases.userCases.length === 0) return 0;
    return cases.userCases.filter(userCase => userCase.caseId === caseId).length;
  };

  // При первом рендере подсчитываем количество
  useEffect(() => {
    const newCount = getUserCaseCount();
    setCount(newCount);
    if (onCountChange) {
      onCountChange(newCount);
    }
  }, []);

  // Подписываемся на изменения в списке кейсов пользователя
  useEffect(() => {
    const newCount = getUserCaseCount();
    if (newCount !== count) {
      setCount(newCount);
      if (onCountChange) {
        onCountChange(newCount);
      }
    }
  }, [cases.userCases]);

  if (cases.loadingUserCases) {
    return <Skeleton className="w-24 h-5" />;
  }

  if (count <= 0) {
    return null;
  }

  return (
    <div className={styles.userCaseCount}>
      <span className="text-sm text-green-500 font-medium">You have: {count}</span>
    </div>
  );
});

export default UserCaseCount; 