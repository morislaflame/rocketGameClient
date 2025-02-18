import { useContext, useRef, useEffect, useState } from "react";
import { Context } from "@/main";
import rocketImg from '../../assets/rocket.svg';
import rocketBlured from '../../assets/rocketblured.svg';
import planetImg from '../../assets/planet.svg';
import { observer } from "mobx-react-lite";
import styles from './mainComponents.module.css';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GoAlertFill } from "react-icons/go";
import gsap from "gsap";

const RocketLaunch = observer(() => {
  const { user, game } = useContext(Context);
  const [showAlert, setShowAlert] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Анимация появления алерта при его монтировании
  useEffect(() => {
    if (showAlert && alertRef.current) {
      gsap.fromTo(
        alertRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    }
  }, [showAlert]);

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
      // Вызываем mutation
      await game.launchRocket();
      if (user.user) {
        user.setUser({
          ...user.user,
          balance: game.newBalance ?? 0,
        });
      }
      console.log(user);
    } catch (err) {
      console.error("Error launching rocket:", err);
    }
  };

  const handleCloseAlert = () => {
    if (alertRef.current) {
      gsap.to(alertRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => setShowAlert(false),
      });
    } else {
      setShowAlert(false);
    }
  };

  return (
    <div>
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

      {/* Alert, который появляется при клике на заблюренные ракеты */}
      {showAlert && (
        <Alert className={styles.alert} variant="default" ref={alertRef}>
          <GoAlertFill size={24} />
          <div className={styles.alertContent}>
            <div className={styles.alertContentText}>
              <AlertTitle>Very soon...</AlertTitle>
              <AlertDescription>
                Check for updates in our{" "}
                <a
                  href="https://t.me/updates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.telegramLink}
                >
                  Telegram
                </a>
              </AlertDescription>
            </div>
          </div>
          <button className={styles.alertButton} onClick={handleCloseAlert}>
            OK
          </button>
        </Alert>
      )}
    </div>
  );
});

export default RocketLaunch;
