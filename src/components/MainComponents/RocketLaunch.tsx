import { useContext, useRef, useEffect, useState } from "react";
import { Context, IStoreContext } from "@/store/StoreProvider";
import rocketImg from '../../assets/rocket.svg';
import rocketBlured from '../../assets/rocketblured.svg';
import planetImg from '../../assets/planet.svg';
import { observer } from "mobx-react-lite";
import styles from './mainComponents.module.css';
import gsap from "gsap";
import SoonAlert from "../FunctionalComponents/SoonAlert";
import ShopDrawer from "./ShopComponents/ShopDrawer";


const RocketLaunch = observer(() => {
  const { user, game } = useContext(Context) as IStoreContext;
  const [showAlert, setShowAlert] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // При изменении результата запуска устанавливаем showResult в true
  useEffect(() => {
    if (game.rocketResult) {
      setShowResult(true);
    }
  }, [game.rocketResult]);

  // Когда showResult становится true, запускаем анимацию
  useEffect(() => {
    if (showResult && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
      gsap.to(resultRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        delay: 1.5,
        onComplete: () => setShowResult(false),
      });
    }
  }, [showResult]);

  const handleLaunchClick = async () => {
    try {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred("soft");
      }
      await game.launchRocket();
      if (user.user) {
        user.setUser({
          ...user.user,
          balance: game.newBalance ?? 0,
          attempts: game.attemptsLeft ?? 0,
        });
      }
      console.log(user);
    } catch (err) {
      console.error("Error launching rocket:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={styles.shopButtonContainer}>
      <ShopDrawer />
      </div>
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Клики на заблюренную ракету открывают Alert */}
        <img
          src={rocketBlured}
          alt="Rocket"
          className={styles.rocketBluredLeft}
          onClick={() => setShowAlert(true)}
          onContextMenu={(e) => e.preventDefault()}
        />
        
          <img
            src={rocketImg}
            alt="Rocket"
            className={styles.rocketImg}
            onClick={handleLaunchClick}
            onContextMenu={(e) => e.preventDefault()}
          />
        <img
          src={rocketBlured}
          alt="Rocket"
          className={styles.rocketBluredRight}
          onClick={() => setShowAlert(true)}
          onContextMenu={(e) => e.preventDefault()}
        />
        
        {/* Результат запуска, показываемый в правом верхнем углу */}
        {showResult && (
          <div ref={resultRef} className={styles.resultBadge}>
            <img src={planetImg} alt="Planet" className={styles.resultIcon} />
            <span className={styles.resultText}>+{game.rocketResult}</span>
          </div>
        )}
      </div>

      {game.error && <p style={{ color: "red" }}>Failed to launch rocket</p>}

      <SoonAlert showAlert={showAlert} onClose={() => setShowAlert(false)} />
    </div>
  );
});

export default RocketLaunch;
