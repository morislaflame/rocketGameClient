import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Roulette from '@/components/MainComponents/RouletteComponents/Roulette'
import { gsap } from 'gsap'
import styles from './RoulettePage.module.css'
import { useParams, useNavigate } from 'react-router-dom'
import { Context, IStoreContext } from '@/store/StoreProvider'
import { Skeleton } from '@/components/ui/skeleton'

const RoulettePage: React.FC = observer(() => {
  const { caseId } = useParams<{ caseId: string }>();
  const { cases } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Загружаем данные о кейсе при монтировании компонента
  useEffect(() => {
    const loadCase = async () => {
      if (caseId) {
        setLoading(true);
        const result = await cases.fetchOneCase(parseInt(caseId));
        setLoading(false);
        
        // Если кейс не найден, вернуться на страницу кейсов
        if (!result) {
          navigate('/cases');
        }
      } else {
        // Если ID кейса не указан, вернуться на страницу кейсов
        navigate('/cases');
      }
    };
    
    loadCase();
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
      </div>
    </div>
  )
})

export default RoulettePage  