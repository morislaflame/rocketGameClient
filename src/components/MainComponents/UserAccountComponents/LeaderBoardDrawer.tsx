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


const LeaderboardDrawer: React.FC = observer(() => {
  const { user } = React.useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
                    <CardDescription style={{ color: "#8E8E93" }}>
                      #{index + 1}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className={styles.topUserCardContent}>
                    {u.balance} <img src={getPlanetImg()} alt="Planet" />
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
