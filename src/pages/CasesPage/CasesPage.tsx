import React, { useLayoutEffect, useRef, useContext, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import styles from './casesPage.module.css';
import { ScrollArea } from '@/components/ui/scroll-area';
import CasesList from '@/components/MainComponents/CasesComponents/CasesList';
import { Context, IStoreContext } from '@/store/StoreProvider';
import { observer } from 'mobx-react-lite';
import CasesHeader from '@/components/MainComponents/CasesComponents/CasesHeader';

const CasesPage: React.FC = observer(() => {
  const { user, cases } = useContext(Context) as IStoreContext;
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  // Загружаем информацию о пользователе и его кейсах при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (user.isAuth) {
          // Загружаем данные о пользователе и его кейсах параллельно
          await Promise.all([
            user.fetchMyInfo(),
            cases.fetchUserCases()
          ]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, cases]);

  useLayoutEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  // Получаем баланс пользователя (mobx автоматически отследит изменения)
  const balance = user?.user?.balance ?? 0;

  return (
    <div className={styles.Container} ref={containerRef}>
      <ScrollArea className={styles.scrollArea}>
        <div className='flex flex-col items-center gap-2 w-full h-full overflow-hidden'>
          <CasesHeader 
            loading={loading}
            balance={balance}
          />
        </div>
        <CasesList />
      </ScrollArea>
    </div>
  );
});

export default CasesPage;