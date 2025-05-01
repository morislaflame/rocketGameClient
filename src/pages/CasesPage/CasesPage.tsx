import React, { useLayoutEffect, useRef, useContext, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import styles from './casesPage.module.css';
import { ScrollArea } from '@/components/ui/scroll-area';
import CasesList from '@/components/MainComponents/CasesComponents/CasesList';
import { Context, IStoreContext } from '@/store/StoreProvider';
import { getPlanetImg } from '@/utils/getPlanetImg';
import { Skeleton } from '@/components/ui/skeleton';
import { observer } from 'mobx-react-lite';

const CasesPage: React.FC = observer(() => {
  const { user, cases } = useContext(Context) as IStoreContext;
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const planetImg = getPlanetImg();

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
          <h2 className="text-3xl font-semibold leading-none tracking-tight">
              LootBoxes
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            Win gifts from the lootbox!
          </div>
          
          {/* Отображение баланса с учетом загрузки */}
          <div className="flex items-center justify-center gap-2 mb-4 bg-black/30 px-6 py-2.5 rounded-full">
            {loading ? (
              <Skeleton className="w-24 h-6" />
            ) : (
              <>
                <img src={planetImg} alt="Planet" className="w-6 h-6" />
                <span className="font-medium text-lg">{balance}</span>
              </>
            )}
          </div>
        </div>
        <CasesList />
      </ScrollArea>
    </div>
  );
});

export default CasesPage;