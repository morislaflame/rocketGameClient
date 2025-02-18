import { useContext, useRef, useEffect, useState } from "react";
import { Context } from "@/main";
import rocketImg from '../../assets/rocket.svg';
import rocketBlured from '../../assets/rocketblured.svg';
import { observer } from "mobx-react-lite";
import styles from './mainComponents.module.css';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GoAlertFill } from "react-icons/go";
import gsap from "gsap";

const RocketLaunch = observer(() => {
  const { user, game } = useContext(Context);
  const [showAlert, setShowAlert] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);

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
      console.error('Error launching rocket:', err);
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
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* При клике на заблюренную ракету показываем Alert */}
        <img
          src={rocketBlured}
          alt="Rocket"
          className={styles.rocketBluredLeft}
          onClick={() => setShowAlert(true)}
        />
        {game.loading ? (
          <p>Launching rocket...</p>
        ) : (
          <img
            src={rocketImg}
            alt="Rocket"
            className={styles.rocketImg}
            onClick={handleLaunchClick}
          />
        )}
        <img
          src={rocketBlured}
          alt="Rocket"
          className={styles.rocketBluredRight}
          onClick={() => setShowAlert(true)}
        />
      </div>

      {game.rocketResult && (
        <div style={{ marginTop: 20 }}>
          <h2>Rocket Result: {game.rocketResult}</h2>
          <h3>New Balance: {game.newBalance}</h3>
        </div>
      )}
      {game.error && <p style={{ color: 'red' }}>Failed to launch rocket</p>}

      {/* Alert, который появляется при клике на заблюренные ракеты */}
      {showAlert && (
        <Alert className={styles.alert} variant='default' ref={alertRef}>
          <GoAlertFill size={24} />
          <div className={styles.alertContent}>
            <div className={styles.alertContentText}>
                <AlertTitle>Very soon...</AlertTitle>
                <AlertDescription>
                Check for updates in our{' '}
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
          <button
            className={styles.alertButton}
            onClick={handleCloseAlert}
          >
            OK
          </button>
        </Alert>
      )}
    </div>
  );
});

export default RocketLaunch;
