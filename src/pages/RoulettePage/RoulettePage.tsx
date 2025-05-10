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
import { getPlanetImg } from '@/utils/getPlanetImg'
import CaseContents from '@/components/MainComponents/RouletteComponents/CaseContents'
import { ScrollArea } from '@/components/ui/scroll-area'
import useBackButton from '@/utils/useBackButton'
import { useTranslate } from '@/utils/useTranslate'

const RoulettePage: React.FC = observer(() => {
  const { caseId } = useParams<{ caseId: string }>();
  const { cases, user } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [_userCaseCount, setUserCaseCount] = useState<number>(0);
  const [_loadingUserCases, setLoadingUserCases] = useState(false);
  const planetImg = getPlanetImg();
  const { t } = useTranslate();
  const containerRef = useRef<HTMLDivElement>(null);

  useBackButton(true, () => navigate(-1));

  // Загружаем данные о кейсе и кейсах пользователя при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      if (!caseId) {
        navigate('/cases');
        return;
      }
      
      const caseIdNum = parseInt(caseId);
      
      // Проверяем кеш и текущий выбранный кейс
      const cachedCase = cases.casesCache[caseIdNum];
      const isSameCase = cases.selectedCase && cases.selectedCase.id === caseIdNum;
      
      // Если кейс уже в кеше или является текущим выбранным, обновляем selectedCase
      if (cachedCase && !isSameCase) {
        cases.setSelectedCase(cachedCase);
      }
      
      // Определяем необходимость загрузки данных
      const needFetchCase = !cachedCase && !isSameCase;
      const needFetchUserCases = cases.userCases.length === 0 && !cases.loadingUserCases;
      const needFetchUserInfo = !user.user?.balance;
      
      // Если нужно загрузить хотя бы что-то, показываем индикатор загрузки
      if (needFetchCase || needFetchUserCases || needFetchUserInfo) {
        setLoading(true);
        
        try {
          const promises = [];
          
          // Загружаем кейс только если необходимо
          if (needFetchCase) {
            const casePromise = cases.fetchOneCase(caseIdNum);
            promises.push(casePromise);
            
            // Обработка ошибки загрузки кейса
            const caseResult = await casePromise;
            if (!caseResult) {
              navigate('/cases');
              return;
            }
          }
          
          // Загружаем кейсы пользователя если необходимо
          if (needFetchUserCases) {
            setLoadingUserCases(true);
            promises.push(cases.fetchUserCases().then(() => {
              setLoadingUserCases(false);
            }));
          }
          
          // Загружаем информацию о пользователе если необходимо
          if (needFetchUserInfo) {
            promises.push(user.fetchMyInfo());
          }
          
          // Ждем завершения всех запросов
          if (promises.length > 0) {
            await Promise.all(promises);
          }
        } catch (error) {
          console.error("Error loading case data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, [caseId, cases, navigate, user]);

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

  // Обработчик успешного открытия кейса
  const handleCaseOpened = async () => {
    setLoadingUserCases(true);
    await cases.fetchUserCases();
    setLoadingUserCases(false);
  };

  const balance = user?.user?.balance ?? 0;


  // Если данные загружаются, показываем скелетон загрузки
  if (loading) {
    return (
      <div className={styles.Container} ref={containerRef}>
        <div className='flex flex-col items-center gap-4 w-full h-full overflow-hidden '>
        <div className='flex flex-col items-center gap-2'>
          <h2 className="text-3xl font-semibold leading-none tracking-tight">
              {t('case')}
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {t('open_case_and_get_a_gift')}
          </div>
          </div>
          <div className='flex flex-col items-center gap-2 bg-[#1a1919] rounded-md p-4 w-full'>
            <Skeleton className="h-40 w-full" />
          </div>
          <div className='flex flex-col items-center gap-2 bg-[#1a1919] rounded-md p-4 w-80'>
            <Skeleton className="h-30 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Container} ref={containerRef}>
      
      <div className='flex flex-col items-center gap-4 w-full overflow-hidden'>
        <div className='flex flex-col items-center gap-2'>
          <h2 className="text-3xl font-semibold leading-none tracking-tight">
              {cases.selectedCase?.name || 'Case'}
          </h2>
          <div className="flex items-center justify-center gap-2 bg-black/30 px-6 rounded-full">
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
        <div className='w-full'>
          {cases.selectedCase && (
            <Roulette 
              caseData={cases.selectedCase} 
              onCaseOpened={handleCaseOpened}
            />
          )}
        </div>
        <ScrollArea className={styles.scrollArea}>
          {cases.selectedCase && (
            <CaseContents caseData={cases.selectedCase} />
          )}
          
          {cases.selectedCase && cases.selectedCase.type !== 'free' && (
            <div className='w-full flex justify-center'>
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
            </div>
          )}
        </ScrollArea>
      </div>
      
    </div>
  )
})

export default RoulettePage  