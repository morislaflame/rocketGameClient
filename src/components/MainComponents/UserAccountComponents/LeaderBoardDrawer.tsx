// src/components/UserAccount/LeaderboardDrawer.tsx
import React, { useCallback, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context, IStoreContext } from "@/store/StoreProvider";
import LeaderBoardList from "./LeaderBoardList";

const LeaderboardDrawer: React.FC = observer(() => {
  const { user } = useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Вызываем fetchTopUsers при открытии диалога и устанавливаем состояние загрузки
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
    <LeaderBoardList
      isLoading={isLoading}
      users={user.users}
      onOpen={handleLeaderboardOpen}
    />
  );
});

export default LeaderboardDrawer;
