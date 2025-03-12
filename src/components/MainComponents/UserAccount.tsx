import React, { useRef, useLayoutEffect, useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './mainComponents.module.css';
import UserHeader from '@/components/MainComponents/UserAccountComponents/UserHeader';
import TasksDrawer from '@/components/MainComponents/UserAccountComponents/TaskDrawer';
import UserPrizeDrawer from '@/components/MainComponents/UserAccountComponents/UserPrizeDrawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import UserAccCard from '../ui/UserAccCard';
import { FaUserFriends } from 'react-icons/fa';
import { PARTNERS_ROUTE } from '@/utils/consts';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Context, IStoreContext } from '@/store/StoreProvider';

const UserAccount: React.FC = observer(() => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(Context) as IStoreContext;

  useEffect(() => {
    if (user.user) {
      user.fetchMyInfo();
    }
  }, [user.user]);

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
          <UserAccCard
            title="Affiliate"
            icon={<FaUserFriends />}
            description="Invite friends and get rewards"
            onClick={() => {
              navigate(PARTNERS_ROUTE);
            }}
          />
        </div>
      </ScrollArea>
    </div>
  );
});

export default UserAccount;
