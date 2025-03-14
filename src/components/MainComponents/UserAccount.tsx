import React, { useRef, useLayoutEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './mainComponents.module.css';
import UserHeader from '@/components/MainComponents/UserAccountComponents/UserHeader';
import TasksDrawer from '@/components/MainComponents/UserAccountComponents/TaskDrawer';
import UserPrizeDrawer from '@/components/MainComponents/UserAccountComponents/UserPrizeDrawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { gsap } from 'gsap';
import AffiliateCard from './UserAccountComponents/AffiliateCard';

const UserAccount: React.FC = observer(() => {
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
        <UserHeader />
        <div className={styles.cardContainer}>
          <TasksDrawer />
          <UserPrizeDrawer />
          <AffiliateCard />
        </div>
      </ScrollArea>
    </div>
  );
});

export default UserAccount;
