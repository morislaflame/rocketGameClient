// src/components/UserAccount/UserAccount.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './mainComponents.module.css';
import UserHeader from '@/components/MainComponents/UserAccountComponents/UserHeader';
import LeaderboardDrawer from '@/components/MainComponents/UserAccountComponents/LeaderBoardDrawer';
import TasksDrawer from '@/components/MainComponents/UserAccountComponents/TaskDrawer';
import UserPrizeDrawer from '@/components/MainComponents/UserAccountComponents/UserPrizeDrawer';
import { ScrollArea } from '@radix-ui/react-scroll-area';

const UserAccount: React.FC = observer(() => {

  return (
    <div className={styles.Container}>
      <ScrollArea className="h-[100%] w-[100%] rounded-md">
        <div className='h-[100%] w-[100%]'>
          <UserHeader />
          <div className={styles.cardContainer}>
            <LeaderboardDrawer />
            <TasksDrawer />
            <UserPrizeDrawer />
          </div>
      </div>
      </ScrollArea>
    </div>
  );
});

export default UserAccount;
