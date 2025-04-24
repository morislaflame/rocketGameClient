import { observer } from 'mobx-react-lite'
import React, { useLayoutEffect, useRef } from 'react'
import Roulette from '@/components/MainComponents/RouletteComponents/Roulette'
import { gsap } from 'gsap'
import styles from './RoulettePage.module.css'
const RoulettePage: React.FC = observer(() => {

  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);


  return (
    <div className={styles.Container} ref={containerRef}>
      <div className='flex flex-col items-center gap-7 w-full h-full overflow-hidden'>
        <div className='flex flex-col items-center gap-2'>
          <h2 className="text-3xl font-semibold leading-none tracking-tight">
              LootBox #1
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Win gifts from the lootbox!
          </div>
        </div>
        <div className='w-full h-full'>
          <Roulette />
        </div>
      </div>
    </div>
  )
})

export default RoulettePage  