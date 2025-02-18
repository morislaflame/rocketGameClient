import React, { createContext, useState, useEffect } from "react";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import GameStore from "./GameStore";
import UserStore from "./UserStore";

// Create Context
export const Context = createContext<{
  user: UserStore;
  game: GameStore;
} | null>(null);


const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState<{
    user: UserStore;
    game: GameStore;
  } | null>(null);

  useEffect(() => {
    const loadStores = async () => {
      const [
        { default: UserStore },
      ] = await Promise.all([
        import("./UserStore"),
        import("./GameStore"),
      ]);

      setStores({
        user: new UserStore(),
        game: new GameStore(),
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
