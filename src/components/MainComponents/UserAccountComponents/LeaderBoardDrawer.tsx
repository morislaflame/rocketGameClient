// src/components/UserAccount/LeaderboardDrawer.tsx
import React, { useCallback, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context, IStoreContext } from "@/store/StoreProvider";
import LeaderBoardList from "./LeaderBoardList";

const LeaderboardDrawer: React.FC = observer(() => {
  const { user } = useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Вызываем fetchLeaderboard при открытии диалога и устанавливаем состояние загрузки
  const handleLeaderboardOpen = useCallback(async () => {
    try {
      setIsLoading(true);
      await user.fetchLeaderboard();
    } catch (error) {
      console.error("Error during fetching leaderboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <LeaderBoardList
      isLoading={isLoading}
      users={user.users}
      onOpen={handleLeaderboardOpen}
      settings={user.leaderboardSettings || undefined}
    />
  );
});

export default LeaderboardDrawer;
