import { useContext, useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context, IStoreContext } from "./store/StoreProvider";
import "./App.css";
import LoadingIndicator from "./components/ui/LoadingIndicator";
import DailyRewardModal from "./components/FunctionalComponents/DailyRewardModal";
import { postEvent } from "@telegram-apps/sdk";
import Navigation from "./components/MainComponents/Navigation";

// Lazy-loaded Components

const AppRouter = lazy(() => import("./AppRouter"));


const App = observer(() => {
  const { user, dailyReward } = useContext(Context) as IStoreContext;
  const [loading, setLoading] = useState(true);

  const tg = window.Telegram?.WebApp;
  console.log(tg);

  useEffect(() => {
    try {
      postEvent("web_app_expand");
      postEvent("web_app_set_header_color", { color: "#000000" });
      postEvent("web_app_set_background_color", { color: "#000000" });
      postEvent("web_app_setup_swipe_behavior", {
        allow_vertical_swipe: false,
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    const authenticate = async () => {
      const initData = tg?.initData;
      console.log("Init Data:", initData); // Для отладки

      if (initData) {
        try {
          // Выполняем аутентификацию через Telegram
          await user.telegramLogin(initData);
        } catch (error) {
          console.error("Telegram authentication error:", error);
        }
      }

      try {
        // Выполняем проверку состояния аутентификации
        await user.checkAuth();
      } catch (error) {
        console.error("Check authentication error:", error);
      }

      setLoading(false);
    };

    authenticate();
  }, [user]);

  useEffect(() => {
    if (!loading && user.isAuth) {
      const checkDailyRewardFn = async () => {
        try {
          await dailyReward.checkDailyReward();
        } catch (error) {
          console.error("Error checking daily reward:", error);
        }
      };
      checkDailyRewardFn();
    }
  }, [loading, user.isAuth, dailyReward]);

  if (loading) {
    return (
      <div className="loading">
        <LoadingIndicator />
      </div>
    );
  }

  if (user.isTooManyRequests) {
    return (
      <div className="loading">
        <h1>Too Many Requests</h1>
        <p>Please try again later</p>
      </div>
    );
  }

  return (
    // <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      <BrowserRouter>
        
      
      <Suspense
        fallback={
          <LoadingIndicator />
        }
      >
        <AppRouter />
      </Suspense>
      <Navigation />
        <DailyRewardModal />
    </BrowserRouter>
    // </TonConnectUIProvider>
  );
});

export default App;
