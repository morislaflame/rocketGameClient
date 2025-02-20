import React, { createContext, useState, useEffect } from "react";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import GameStore from "./GameStore";
import UserStore from "./UserStore";
import TaskStore from "./TaskStore";
import DailyRewardStore from "./DailyRewardStore";
import ProductStore from "./ProductStore";
// Create Context
export const Context = createContext<{
  user: UserStore;
  game: GameStore;
  task: TaskStore;
  dailyReward: DailyRewardStore;
  product: ProductStore;
} | null>(null);


const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState<{
    user: UserStore;
    game: GameStore;
    task: TaskStore;
    dailyReward: DailyRewardStore;
    product: ProductStore;
  } | null>(null);

  useEffect(() => {
    const loadStores = async () => {
      const [
        { default: UserStore },
        { default: GameStore },
        { default: TaskStore },
        { default: DailyRewardStore },
        { default: ProductStore },
      ] = await Promise.all([
        import("./UserStore"),
        import("./GameStore"),
        import("./TaskStore"),
        import("./DailyRewardStore"),
        import("./ProductStore"),
      ]);

      setStores({
        user: new UserStore(),
        game: new GameStore(),
        task: new TaskStore(),
        dailyReward: new DailyRewardStore(),
        product: new ProductStore(),
      });
    };

    loadStores();
  }, []);

  if (!stores) {
    return <LoadingIndicator />; // Use custom loading indicator
  }

  return <Context.Provider value={stores}>{children}</Context.Provider>;
};

export default StoreProvider;
