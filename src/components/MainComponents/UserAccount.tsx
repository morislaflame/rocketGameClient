// src/components/UserAccount/UserAccount.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '@/main';
import styles from './UserAccount.module.css';
import UserHeader from '@/components/MainComponents/UserAccountComponents/UserHeader';
import LeaderboardDrawer from '@/components/MainComponents/UserAccountComponents/LeaderBoardDrawer';
import TasksDrawer from '@/components/MainComponents/UserAccountComponents/TaskDrawer';
import { getUserName } from '@/utils/getUserName';

const UserAccount: React.FC = observer(() => {
  const { user } = React.useContext(Context);

  return (
    <div className={styles.pageContent}>
      <UserHeader username={getUserName(user.user)} />
      <div className={styles.cardContainer}>
        <LeaderboardDrawer />
        <TasksDrawer />
      </div>
    </div>
  );
});

export default UserAccount;
