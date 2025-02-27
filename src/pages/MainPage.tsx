import React, { useContext, lazy, Suspense } from 'react';
import { Context, IStoreContext } from '@/store/StoreProvider';
import { observer } from 'mobx-react-lite';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import RocketLaunch from '@/components/MainComponents/RocketLaunch';
import { type CarouselApi } from "@/components/ui/carousel";
import { AiFillHome } from 'react-icons/ai';
import { AiFillDollarCircle } from 'react-icons/ai';
import NavButton from '@/components/ui/NavButton';
import { AiOutlineUser } from 'react-icons/ai';
import styles from './Main.module.css';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import ListSkeleton from '@/components/MainComponents/ListSkeleton';

const UserAccount = lazy(() => import('@/components/MainComponents/UserAccount'));
const Shop = lazy(() => import('@/components/MainComponents/Shop'));


const MainPage: React.FC = observer(() => {
  const { user } = useContext(Context) as IStoreContext;
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
 
  React.useEffect(() => {
    if (!api) return;
 
    setCount(api.scrollSnapList().length);
    // 0-based индекс
    setCurrent(api.selectedScrollSnap());
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Обработчик клика по кнопкам навигации
  const handleNavClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  // Константы (px)
  const paddingLeft = 12;
  const buttonWidth = 48;
  const gap = 12;
  const indicatorWidth = 76;
  // Вычисляем центр кнопки и позицию индикатора
  const buttonCenter = paddingLeft + current * (buttonWidth + gap) + buttonWidth / 2;
  // По умолчанию left = center - indicatorWidth/2, но для первого элемента получалось -2, поэтому добавляем поправку +2
  const indicatorLeft = buttonCenter - indicatorWidth / 2 + 2;

  return (
    <div data-count={count} className={styles.mainPage}>
      {user?.isAuth ? (
        <div className={styles.mainContent}>
          <Carousel setApi={setApi} style={{ width: '100%', flex: '1', willChange: 'transform' }}>
            <CarouselContent style={{ width: '100vw', height: '100vh', margin: '0', padding: '0', willChange: 'transform' }}>
              <CarouselItem className={styles.carouselItem} id="0">
                <RocketLaunch />
              </CarouselItem>
              <CarouselItem className={styles.carouselItem} id="1">
                <Suspense fallback={<ListSkeleton />}>
                  <Shop />
                </Suspense>
              </CarouselItem>
              <CarouselItem className={styles.carouselItem} id="2">
                <Suspense fallback={<LoadingIndicator />}>
                  <UserAccount />
                </Suspense>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          <div className={styles.navigation}>
            <div className={styles.navButtons}>
              {/* Индикатор активного таба */}
              <div
                className={styles.activeIndicator}
                style={{ left: `${indicatorLeft}px` }}
              />
              <NavButton 
                img={<AiFillHome />} 
                onClick={() => handleNavClick(0)}
              />
              <NavButton 
                img={<AiFillDollarCircle />} 
                onClick={() => handleNavClick(1)}
              />
              <NavButton 
                img={<AiOutlineUser />} 
                onClick={() => handleNavClick(2)}
              />
            </div>
          </div>
        </div>
      ) : (
        <p>Please log in to launch the rocket.</p>
      )}
    </div>
  );
});

export default MainPage;
