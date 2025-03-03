import { useContext, useRef, useEffect, useState } from "react";
import { Context, IStoreContext } from "@/store/StoreProvider";
import spritesheet from '../../assets/spritesheet.png';
import planetImg from '../../assets/planet.svg';
import { observer } from "mobx-react-lite";
import styles from './mainComponents.module.css';
import gsap from "gsap";
import SoonAlert from "../FunctionalComponents/SoonAlert";
import ShopDrawer from "./ShopComponents/ShopDrawer";
import rocketBlured from '../../assets/rocketblured.svg';

// Интерфейс для описания фрейма спрайта
interface SpriteFrame {
  frameId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const RocketLaunch = observer(() => {
  const { user, game } = useContext(Context) as IStoreContext;
  const [showAlert, setShowAlert] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const tapToLaunchRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const animationFrameRef = useRef<number>(0);
  const spriteImageRef = useRef<HTMLImageElement | null>(null);
  const framesRef = useRef<SpriteFrame[]>([]);

  // Загрузка спрайтшита и парсинг карты спрайтов
  useEffect(() => {
    // Карта спрайтов
    const spriteMapData = `
000,0,1026,512,512
001,513,1026,512,512
002,1026,0,512,512
003,1026,513,512,512
004,1026,1026,512,512
005,0,1539,512,512
006,513,1539,512,512
007,1026,1539,512,512
008,1539,0,512,512
009,1539,513,512,512
010,1539,1026,512,512
011,1539,1539,512,512
012,0,2052,512,512
013,513,2052,512,512
014,1026,2052,512,512
015,1539,2052,512,512
016,2052,0,512,512
017,2052,513,512,512
018,2052,1026,512,512
019,2052,1539,512,512
020,2052,2052,512,512
021,0,2565,512,512
022,513,2565,512,512
023,1026,2565,512,512
024,1539,2565,512,512
025,2052,2565,512,512
026,2565,0,512,512
027,2565,513,512,512
028,2565,1026,512,512
029,2565,1539,512,512
030,2565,2052,512,512
031,2565,2565,512,512
032,0,3078,512,512
033,513,3078,512,512
034,1026,3078,512,512
035,1539,3078,512,512
036,2052,3078,512,512
037,2565,3078,512,512
038,3078,0,512,512
039,3078,513,512,512
040,3078,1026,512,512
041,3078,1539,512,512
042,3078,2052,512,512
043,3078,2565,512,512
044,3078,3078,512,512
045,0,3591,512,512
046,513,3591,512,512
047,1026,3591,512,512
048,1539,3591,512,512
049,2052,3591,512,512
050,2565,3591,512,512
051,3078,3591,512,512
052,3591,0,512,512
053,3591,513,512,512
054,3591,1026,512,512
055,3591,1539,512,512
056,3591,2052,512,512
057,3591,2565,512,512
058,3591,3078,512,512
059,3591,3591,512,512
060,0,4104,512,512
061,513,4104,512,512
062,1026,4104,512,512
063,1539,4104,512,512
064,2052,4104,512,512
065,2565,4104,512,512
066,3078,4104,512,512
067,3591,4104,512,512
068,4104,0,512,512
069,4104,513,512,512
070,4104,1026,512,512
071,4104,1539,512,512
072,4104,2052,512,512
073,4104,2565,512,512
074,4104,3078,512,512
075,4104,3591,512,512
076,4104,4104,512,512
077,0,4617,512,512
078,513,4617,512,512
079,1026,4617,512,512
080,1539,4617,512,512
081,2052,4617,512,512
082,2565,4617,512,512
083,3078,4617,512,512
084,3591,4617,512,512
085,4104,4617,512,512
086,4617,0,512,512
087,4617,513,512,512
088,4617,1026,512,512
089,4617,1539,512,512
090,4617,2052,512,512
091,4617,2565,512,512
092,4617,3078,512,512
093,4617,3591,512,512
094,4617,4104,512,512
095,4617,4617,512,512
096,0,5130,512,512
097,513,5130,512,512
098,1026,5130,512,512
099,1539,5130,512,512
100,2052,5130,512,512
101,2565,5130,512,512
102,3078,5130,512,512
103,3591,5130,512,512
104,4104,5130,512,512
105,4617,5130,512,512
106,5130,0,512,512
107,5130,513,512,512
108,5130,1026,512,512
109,5130,1539,512,512
110,5130,2052,512,512
111,5130,2565,512,512
112,5130,3078,512,512
113,5130,3591,512,512
114,5130,4104,512,512
115,5130,4617,512,512
116,5130,5130,512,512
117,0,5643,512,512
118,513,5643,512,512
119,1026,5643,512,512
120,1539,5643,512,512
121,2052,5643,512,512
122,2565,5643,512,512
123,3078,5643,512,512
124,3591,5643,512,512
125,4104,5643,512,512
126,4617,5643,512,512
127,5130,5643,512,512
128,5643,0,512,512
129,5643,513,512,512
130,5643,1026,512,512
131,5643,1539,512,512
132,5643,2052,512,512
133,5643,2565,512,512
134,5643,3078,512,512
135,5643,3591,512,512
136,5643,4104,512,512
137,5643,4617,512,512
138,5643,5130,512,512
139,5643,5643,512,512
140,0,6156,512,512
141,513,6156,512,512
142,1026,6156,512,512
143,1539,6156,512,512
144,2052,6156,512,512
145,2565,6156,512,512
146,3078,6156,512,512
147,3591,6156,512,512
148,4104,6156,512,512
149,4617,6156,512,512
150,5130,6156,512,512
151,5643,6156,512,512
152,6156,0,512,512
153,6156,513,512,512
154,6156,1026,512,512
155,6156,1539,512,512
156,6156,2052,512,512
157,6156,2565,512,512
158,6156,3078,512,512
159,6156,3591,512,512
160,6156,4104,512,512
161,6156,4617,512,512
162,6156,5130,512,512
163,6156,5643,512,512
164,6156,6156,512,512
165,0,6669,512,512
166,513,6669,512,512
167,1026,6669,512,512
168,1539,6669,512,512
169,2052,6669,512,512
170,2565,6669,512,512
171,3078,6669,512,512
172,3591,6669,512,512
173,4104,6669,512,512
174,4617,6669,512,512
175,5130,6669,512,512
176,0,0,512,512
177,0,513,512,512
178,513,0,512,512
179,513,513,512,512`;
    
    // Парсинг карты спрайтов
    const frames: SpriteFrame[] = [];
    spriteMapData.split('\n').forEach(line => {
      if (!line.trim()) return;
      const [frameId, x, y, width, height] = line.split(',');
      frames.push({
        frameId,
        x: parseInt(x),
        y: parseInt(y),
        width: parseInt(width),
        height: parseInt(height)
      });
    });
    
    framesRef.current = frames;
    
    // Загрузка спрайтшита
    const spriteImage = new Image();
    spriteImage.src = spritesheet;
    spriteImage.onload = () => {
      spriteImageRef.current = spriteImage;
      // Нарисовать первый кадр (покоящаяся ракета)
      drawFrame(0);
    };
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Функция для отрисовки конкретного кадра из спрайтшита
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const spriteImage = spriteImageRef.current;
    
    if (!canvas || !spriteImage || !framesRef.current[frameIndex]) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Очистка канваса
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Сохраняем текущее состояние контекста
    ctx.save();
    
    // Перемещаем точку отсчета в центр канваса
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Поворачиваем на -20 градусов (преобразуем в радианы)
    const angle = -45 * Math.PI / 180;
    ctx.rotate(angle);
    
    const frame = framesRef.current[frameIndex];
    
    // Рисуем изображение с фиксированными размерами
    // Уменьшаем размер изображения так, чтобы оно помещалось после поворота
    const rocketWidth = 200;  // Подобрать экспериментально
    const rocketHeight = 200; // Подобрать экспериментально
    
    ctx.drawImage(
      spriteImage,
      frame.x, frame.y, frame.width, frame.height,
      -rocketWidth / 2, -rocketHeight / 2, rocketWidth, rocketHeight
    );
    
    // Восстанавливаем контекст
    ctx.restore();
  };

  // Анимация ракеты
  const animateRocket = () => {
    return new Promise<void>((resolve) => {
      let currentFrame = 0;
      const frameCount = framesRef.current.length;
      const fps = 240; // Кадров в секунду
      let lastFrameTime = 0;
      
      const animate = (timestamp: number) => {
        if (!lastFrameTime) lastFrameTime = timestamp;
        
        const elapsed = timestamp - lastFrameTime;
        
        if (elapsed > 1000 / fps) {
          lastFrameTime = timestamp;
          
          // Отрисовка текущего кадра
          drawFrame(currentFrame);
          
          // Переход к следующему кадру
          currentFrame++;
          
          // Если анимация закончилась
          if (currentFrame >= frameCount) {
            // Анимация завершена
            resolve();
            return;
          }
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    });
  };

  // При изменении результата запуска устанавливаем showResult в true
  useEffect(() => {
    if (game.rocketResult) {
      setShowResult(true);
    }
  }, [game.rocketResult]);

  // Анимация для текста "Tap to launch"
  useEffect(() => {
    if (tapToLaunchRef.current && !showResult && !isLaunching) {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(tapToLaunchRef.current, {
        opacity: 0.5,
        scale: 0.95,
        duration: 1.2,
        ease: "power1.inOut"
      });
      
      return () => {
        tl.kill();
      };
    }
  }, [showResult, isLaunching]);

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
        delay: 0.8,
        onComplete: () => setShowResult(false),
      });
    }
  }, [showResult]);

  const handleLaunchClick = async () => {
    // Проверяем, что ракета не запущена и нет анимации результата
    if (isLaunching || showResult) return;
    
    try {
      setIsLaunching(true);
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred("soft");
      }
      
      // Запускаем анимацию ракеты и ждем ее завершения
      await animateRocket();
      
      // После завершения анимации запускаем ракету на сервере
      await game.launchRocket();
      if (user.user) {
        user.setUser({
          ...user.user,
          balance: game.newBalance ?? 0,
          attempts: game.attemptsLeft ?? 0,
        });
      }
      
      // Важно: сбрасываем флаг isLaunching, чтобы ракета стала снова доступной
      setIsLaunching(false);
    } catch (err) {
      console.error("Error launching rocket:", err);
      setIsLaunching(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={styles.shopButtonContainer}>
      <ShopDrawer />
      </div>
      {!showResult && !isLaunching && (
          <div 
            ref={tapToLaunchRef}
            className={styles.tapToLaunch}
            style={{
              position: "absolute",
              top: "15%",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "500",
              color: "rgb(178 177 177)",
              textShadow: "0 0 5px rgba(0,0,0,0.5)",
              zIndex: 10,
              willChange: 'transform, opacity'
            }}
          >
            Tap to launch
          </div>
          
        )}
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <img
          src={rocketBlured}
          alt="Rocket"
          className={styles.rocketBluredLeft}
          onClick={() => setShowAlert(true)}
          onContextMenu={(e) => e.preventDefault()}
        />
        {/* Канвас для отрисовки ракеты */}
        <canvas 
          ref={canvasRef}
          width={260} 
          height={260}
          onClick={handleLaunchClick}
          onContextMenu={(e) => e.preventDefault()}
          className={`${(isLaunching || showResult) ? styles.disabledRocket : ''}`}
          style={{ 
            cursor: (isLaunching || showResult) ? 'default' : 'pointer',
            // opacity: (isLaunching || showResult) ? 0.7 : 1,
            display: 'block'
          }}
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
