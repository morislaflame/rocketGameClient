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
  const [loading, setLoading] = useState(false);

  // Загружаем информацию о пользователе и его кейсах при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      if (!user.isAuth) return;
      
      // Проверяем, нужны ли какие-либо запросы
      const needFetchUser = !user.user?.balance;
      const needFetchCases = cases.userCases.length === 0 && !cases.loadingUserCases;
      
      // Выполняем запросы только если они необходимы
      if (needFetchUser || needFetchCases) {
        setLoading(true);
        
        try {
          const promises = [];
          
          if (needFetchUser) {
            promises.push(user.fetchMyInfo());
          }
          
          if (needFetchCases) {
            promises.push(cases.fetchUserCases());
          }
          
          if (promises.length > 0) {
            await Promise.all(promises);
          }
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setLoading(false);
        }
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