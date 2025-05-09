import { lazy, Suspense, useContext, useEffect, useRef, useState, useLayoutEffect } from "react";
import { Context, IStoreContext } from "@/store/StoreProvider";
import { observer } from "mobx-react-lite";
import gsap from "gsap";
import styles from './mainComponents.module.css';
import SoonAlert from "../FunctionalComponents/SoonAlert";
import { toast } from "sonner";

import rocketBlured from '../../assets/rocketblured.svg';
import planetImg from '../../assets/PLANET_SOLID.png';

// Импортируем Lottie и JSON с анимацией ракеты
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import rocketAnimation from '../../assets/Rocket.json';
import HeaderSkeleton from "./RocketComponents/HeaderSkeleton";
import LeaderboardDrawer from "./UserAccountComponents/LeaderBoardDrawer";
const Header = lazy(() => import("./RocketComponents/Header"));

const RocketLaunch = observer(() => {
  const { user, game } = useContext(Context) as IStoreContext;
  const [showAlert, setShowAlert] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const tapToLaunchRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Реф для управления Lottie-анимацией
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  // Реф для GSAP-анимации контейнера ракеты
  const rocketContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Реф для сохранения промиса запроса на запуск ракеты
  const launchPromiseRef = useRef<ReturnType<typeof game.launchRocket> | null>(null);


  useLayoutEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  // Отслеживаем появление результата для показа бейджа
  useEffect(() => {
    if (game.rocketResult) {
      setShowResult(true);
    }
  }, [game.rocketResult]);

  // Анимация пульсации текста «Tap to launch»
  useEffect(() => {
    if (tapToLaunchRef.current && !showResult && !isLaunching) {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(tapToLaunchRef.current, {
        opacity: 0.5,
        scale: 0.95,
        duration: 1.2,
        ease: "power1.inOut",
      });
      return () => {
        tl.kill();
      };
    }
  }, [showResult, isLaunching]);

  // Анимация появления и исчезновения результата (бейджа)
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
        delay: 0.8,
        onComplete: () => setShowResult(false),
      });
    }
  }, [showResult]);

  // Нажатие на ракету: одновременно запускаем анимацию и отправляем запрос на сервер
  const handleLaunchClick = async () => {
    if (isLaunching || showResult) return;
    
    // Проверяем наличие попыток
    if (user?.user?.attempts === 0) {
      // HapticFeedback для Telegram WebApp (если поддерживается)
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
      }
      
      // Показываем уведомление
      toast.error("You have no attempts left!", {
        description: "Buy additional attempts in the shop or complete tasks",
        position: "top-center",
        duration: 3000,
      });
      
      // Открываем магазин
      return;
    }

    try {
      setIsLaunching(true);

      // HapticFeedback для Telegram WebApp (если поддерживается)
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred("soft");
      }

      // Отправляем запрос на запуск ракеты сразу при клике
      launchPromiseRef.current = game.launchRocket();

      // GSAP-анимация подъёма и спуска ракеты
      if (rocketContainerRef.current) {
        const tl = gsap.timeline();
        tl.to(rocketContainerRef.current, {
          y: -150,
          duration: 1.2,
          ease: "power2.out",
        });
        tl.to(rocketContainerRef.current, {
          y: 0,
          duration: 0.8,
          ease: "bounce.out",
          delay: 0.5,
        });
      }

      // Запускаем Lottie-анимацию
      if (lottieRef.current) {
        lottieRef.current.goToAndStop(0, true); // Сброс анимации в начало
        lottieRef.current.play();
      }
    } catch (err) {
      console.error("Error launching rocket:", err);
      setIsLaunching(false);
    }
  };

  // Обработчик завершения Lottie-анимации
  // Ждём завершения запроса, полученного ранее, и обновляем данные пользователя
  const handleLottieComplete = async () => {
    if (launchPromiseRef.current) {
      try {
        await launchPromiseRef.current;
        if (user.user) {
          user.setUser({
            ...user.user,
            balance: game.newBalance ?? 0,
            attempts: game.attemptsLeft ?? 0,
          });
        }
      } catch (err) {
        console.error("Error launching rocket onComplete:", err);
      } finally {
        setIsLaunching(false);
        launchPromiseRef.current = null;
      }
    }
  };

  return (
    <div className={styles.Container} ref={containerRef}>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>

      {!showResult && !isLaunching && (
        <div
          ref={tapToLaunchRef}
          className={styles.tapToLaunch}
          style={{
            position: "absolute",
            top: "15%",
            textAlign: "center",
            fontSize: "16px",
            fontWeight: 500,
            color: "rgb(178 177 177)",
            textShadow: "0 0 5px rgba(0,0,0,0.5)",
            zIndex: 10,
            willChange: 'transform, opacity',
          }}
        >
          Tap to launch
        </div>
      )}

      <div
        className="flex flex-col flex-1 items-center justify-end relative"
        style={{
          cursor: isLaunching || showResult ? "default" : "pointer",
          willChange: 'transform',
        }}
      >
        <img
          src={rocketBlured}
          alt="Rocket"
          className={styles.rocketBluredLeft}
          onClick={() => setShowAlert(true)}
          onContextMenu={(e) => e.preventDefault()}
        />

        <div
          ref={rocketContainerRef}
          onClick={handleLaunchClick}
          onContextMenu={(e) => e.preventDefault()}
          style={{ position: 'absolute', bottom: '30%' }}
        >
          <Lottie
            lottieRef={lottieRef}
            animationData={rocketAnimation}
            loop={false}
            autoplay={false}
            onComplete={handleLottieComplete}
            style={{
              width: 240,
              height: 240,
              transform: "rotate(-45deg)",
              pointerEvents: "none", // клики идут на контейнер, а не на Lottie
            }}
          />
        </div>

        <img
          src={rocketBlured}
          alt="Rocket"
          className={styles.rocketBluredRight}
          onClick={() => setShowAlert(true)}
          onContextMenu={(e) => e.preventDefault()}
        />

        {showResult && (
          <div ref={resultRef} className={styles.resultBadge}>
            <img src={planetImg} alt="Planet" className={styles.resultIcon} />
            <span className={styles.resultText}>+{game.rocketResult}</span>
          </div>
        )}
        <LeaderboardDrawer />
      </div>

      {game.error && <p style={{ color: "red" }}>Failed to launch rocket</p>}
      <SoonAlert showAlert={showAlert} onClose={() => setShowAlert(false)} />
    </div>
  );
});

export default RocketLaunch;
