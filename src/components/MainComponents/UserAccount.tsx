// src/components/UserAccount/UserAccount.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Context, IStoreContext } from '@/store/StoreProvider';
import styles from './mainComponents.module.css';
import UserHeader from '@/components/MainComponents/UserAccountComponents/UserHeader';
import LeaderboardDrawer from '@/components/MainComponents/UserAccountComponents/LeaderBoardDrawer';
import TasksDrawer from '@/components/MainComponents/UserAccountComponents/TaskDrawer';
import { getUserName } from '@/utils/getUserName';
import UserPrizeDrawer from '@/components/MainComponents/UserAccountComponents/UserPrizeDrawer';

const UserAccount: React.FC = observer(() => {
  const { user } = React.useContext(Context) as IStoreContext;

  return (
    <div className={styles.pageContent}>
      <UserHeader username={getUserName(user?.user)} />
      <div className={styles.cardContainer}>
        <LeaderboardDrawer />
        <TasksDrawer />
        <UserPrizeDrawer />
      </div>
    </div>
  );
});

export default UserAccount;
