import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './casesPage.module.css';
import { ScrollArea } from '@/components/ui/scroll-area';
import CasesList from '@/components/MainComponents/CasesComponents/CasesList';

const CasesPage: React.FC = () => {

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
      <ScrollArea className={styles.scrollArea}>
        <div className='flex flex-col items-center gap-4 w-full h-full overflow-hidden'>
          <h2 className="text-3xl font-semibold leading-none tracking-tight">
              LootBoxes
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Win gifts from the lootbox!
          </div>
        </div>
        <CasesList />
      </ScrollArea>
    </div>
  );
};

export default CasesPage;