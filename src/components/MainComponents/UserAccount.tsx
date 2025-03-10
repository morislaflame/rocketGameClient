// src/components/UserAccount/UserAccount.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './mainComponents.module.css';
import UserHeader from '@/components/MainComponents/UserAccountComponents/UserHeader';
import LeaderboardDrawer from '@/components/MainComponents/UserAccountComponents/LeaderBoardDrawer';
import TasksDrawer from '@/components/MainComponents/UserAccountComponents/TaskDrawer';
import UserPrizeDrawer from '@/components/MainComponents/UserAccountComponents/UserPrizeDrawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import UserAccCard from '../ui/UserAccCard';
import { FaUserFriends } from 'react-icons/fa';
import { PARTNERS_ROUTE } from '@/utils/consts';
import { useNavigate } from 'react-router-dom';

const UserAccount: React.FC = observer(() => {
  const navigate = useNavigate();

  return (
    <div className={styles.Container}>
      <ScrollArea className={styles.scrollArea}>
      <UserHeader />
        <div className={styles.cardContainer}>
          <LeaderboardDrawer />
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
