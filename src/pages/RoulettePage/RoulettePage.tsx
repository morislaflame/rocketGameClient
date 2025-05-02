import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Roulette from '@/components/MainComponents/RouletteComponents/Roulette'
import { gsap } from 'gsap'
import styles from './RoulettePage.module.css'
import { useParams, useNavigate } from 'react-router-dom'
import { Context, IStoreContext } from '@/store/StoreProvider'
import { Skeleton } from '@/components/ui/skeleton'
import UserCaseCount from '@/components/MainComponents/CasesComponents/UserCaseCount'
import CasePurchaseButtons from '@/components/MainComponents/CasesComponents/CasePurchaseButtons'
import casesStyles from '@/components/MainComponents/CasesComponents/CasesComponents.module.css'

const RoulettePage: React.FC = observer(() => {
  const { caseId } = useParams<{ caseId: string }>();
  const { cases } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userCaseCount, setUserCaseCount] = useState<number>(0);
  const [loadingUserCases, setLoadingUserCases] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Загружаем данные о кейсе и кейсах пользователя при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      if (caseId) {
        setLoading(true);
        
        // Загружаем данные о кейсе
        const result = await cases.fetchOneCase(parseInt(caseId));
        
        // Если кейс не найден, вернуться на страницу кейсов
        if (!result) {
          setLoading(false);
          navigate('/cases');
          return;
        }
        
        // Загружаем кейсы пользователя, если они еще не были загружены
        if (!cases.userCases || cases.userCases.length === 0) {
          setLoadingUserCases(true);
          await cases.fetchUserCases();
          setLoadingUserCases(false);
        }
        
        setLoading(false);
      } else {
        // Если ID кейса не указан, вернуться на страницу кейсов
        navigate('/cases');
      }
    };
    
    loadData();
  }, [caseId, cases, navigate]);

  useLayoutEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  // Обработчик изменения количества кейсов
  const handleCountChange = (count: number) => {
    setUserCaseCount(count);
  };

  // Обработчик успешной покупки кейса
  const handlePurchaseSuccess = async () => {
    // После успешной покупки обновляем список кейсов пользователя
    setLoadingUserCases(true);
    // await cases.fetchUserCases();
    setLoadingUserCases(false);
  };

  // Количество кейсов данного типа у пользователя
  // const getUserCaseCount = () => {
  //   if (!cases.userCases || !cases.selectedCase) return 0;
    
  //   // Подсчитываем количество кейсов данного типа у пользователя
  //   return cases.userCases.filter(
  //     userCase => userCase.caseId === cases.selectedCase?.id
  //   ).length;
  // };

  // Если данные загружаются, показываем скелетон загрузки
  if (loading) {
    return (
      <div className={styles.Container} ref={containerRef}>
        <div className='flex flex-col items-center gap-7 w-full h-full overflow-hidden'>
          <div className='flex flex-col items-center gap-2'>
            <Skeleton className="h-10 w-56" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Container} ref={containerRef}>
      <div className='flex flex-col items-center gap-7 w-full h-full overflow-hidden'>
        <div className='flex flex-col items-center gap-2'>
          <h2 className="text-3xl font-semibold leading-none tracking-tight">
              {cases.selectedCase?.name || 'LootBox'}
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Win gifts from the lootbox!
          </div>
        </div>
        <div className='w-full h-full'>
          {cases.selectedCase && <Roulette caseData={cases.selectedCase} />}
        </div>
        
        {cases.selectedCase && cases.selectedCase.type !== 'free' && (
          <div className={casesStyles.casePurchaseButtons}>
            <UserCaseCount 
              caseId={cases.selectedCase.id} 
              onCountChange={handleCountChange}
            />
            
            <CasePurchaseButtons
              caseId={cases.selectedCase.id}
              price={cases.selectedCase.price?.toString() || ''}
              starsPrice={cases.selectedCase.starsPrice || 0}
              pointsPrice={cases.selectedCase.pointsPrice || 0}
              onPurchase={(success) => {
                  if (success) {
                    handlePurchaseSuccess();
                  }
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
})

export default RoulettePage  