// src/components/UserAccount/LeaderboardDrawer.tsx
import React, { useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Context, IStoreContext } from '@/store/StoreProvider';
import styles from './UserAccountComponents.module.css';
import UserAccCard from '@/components/ui/UserAccCard';
import { MdLeaderboard } from "react-icons/md";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserInfo } from '@/types/types';
import { getUserName } from '@/utils/getUserName';
import { getPlanetImg } from '@/utils/getPlanetImg';
import ListSkeleton from '../ListSkeleton';

import tonImg from "@/assets/TonIcon.svg";


const LeaderboardDrawer: React.FC = observer(() => {
  const { user } = React.useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Функция для расчета награды в зависимости от позиции
  const calculateReward = (position: number): number => {
    if (position === 1) return 1000;
    if (position === 2) return 700;
    if (position === 3 || position === 4) return 500;
    if (position === 5) return 300;
    if (position === 6 || position === 7) return 150;
    if (position === 8 || position === 9) return 100;
    // Для остальных - 50 TON (до исчерпания общего пула)
    // Общий пул: 5000
    // Уже распределено: 1000 + 700 + 500*2 + 300 + 150*2 + 100*2 = 3500
    // Осталось: 5000 - 3500 = 1500, что хватит на 30 наград по 50 TON
    if (position >= 10 && position <= 39) return 50;
    return 0;
  };

  // Вызываем fetchTopUsers при открытии Drawer и устанавливаем состояние загрузки
  const handleLeaderboardOpen = useCallback(async () => {
    try {
      setIsLoading(true);
      await user.fetchTopUsers();
    } catch (error) {
      console.error("Error during fetching top users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <Drawer>
      <DrawerTrigger asChild style={{ width: "100%" }}>
        <div onClick={handleLeaderboardOpen}>
          <UserAccCard
            title="Leaderboard"
            icon={<MdLeaderboard />}
            description="View your position on the leaderboard"
          />
        </div>
      </DrawerTrigger>
      <DrawerContent className={styles.drawerContent}>
        <DrawerHeader>
          <DrawerTitle>Leaderboard</DrawerTitle>
          <DrawerDescription>
            The most active users will receive more rewards
          </DrawerDescription>
        </DrawerHeader>
        <div className={styles.totalRewardsPool}>
          <p>Prize pool: 5000 </p>
          <img src={tonImg} alt="TON" 
          style={{ width: "20px", height: "20px", verticalAlign: "middle", }}/>
        </div>
        <ScrollArea
          className="h-[70vh] w-[100%] rounded-md"
          style={{ scrollbarWidth: "none" }}
        >
          <div className={styles.topUsersList}>
            {isLoading ? (
              <ListSkeleton count={5}/>
            ) : user.users.length ? (
              user.users.map((u: UserInfo, index: number) => (
                <Card key={u.id} className={styles.topUserCard}>
                  <CardHeader className={styles.topUserCardHeader}>
                    <CardTitle className={styles.topUserCardTitle}>
                      {getUserName(u)}
                    </CardTitle>
                    <CardDescription style={{ color: "#8E8E93" }} className='flex flex-row items-center gap-2'>
                      #{index + 1} 
                      {calculateReward(index + 1) > 0 && (
                        <span className="flex flex-row items-center gap-1 justify-center">
                          {` • ${calculateReward(index + 1)}`} <img src={tonImg} alt="TON" style={{ width: "16px", height: "16px", verticalAlign: "middle" }} />
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className={styles.topUserCardContent}>
                    {u.balance} <img src={getPlanetImg()} alt="Planet" width={"18px"} height={"18px"}/>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
});

export default LeaderboardDrawer;
