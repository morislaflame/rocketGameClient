import React, { useContext, useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "./main";
import "./App.css";
import LoadingIndicator from "./components/ui/LoadingIndicator";
import DailyRewardModal from "./components/FunctionalComponents/DailyRewardModal";

// Lazy-loaded Components
const Header = lazy(() => import("./components/MainComponents/Header"));
const AppRouter = lazy(() => import("./AppRouter"));


const App = observer(() => {
  const { user, dailyReward } = useContext(Context);
  const [loading, setLoading] = useState(true);


  // useEffect(() => {
  //   let tg =  window.Telegram.WebApp;

  //       if(['ios', 'android'].indexOf(tg.platform) !== -1) {
  //         tg.requestFullscreen();
  //       }
  // }, []);

  useEffect(() => {
    const authenticate = async () => {
      const initData = window.Telegram?.WebApp?.initData;
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
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="loading">
            <LoadingIndicator />
          </div>
        }
      >
        <Header />
        <AppRouter />
        <DailyRewardModal />
      </Suspense>
    </BrowserRouter>
  );
});

export default App;
