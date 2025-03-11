import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { FaUserAstronaut } from 'react-icons/fa6';
import { FaTicket } from 'react-icons/fa6';
import NavButton from '@/components/ui/NavButton';
import styles from './mainComponents.module.css';

const navigationItems = [
    { label: 'Home', route: '/rocket', icon: <FaUserAstronaut size={32} /> },
  { label: 'Raffle', route: '/', icon: <FaTicket size={32} /> },
  { label: 'User', route: '/user-account', icon: <AiFillHome size={32} /> },
];

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Определяем индекс активного раздела по текущему маршруту
  const activeIndex = navigationItems.findIndex(
    item => item.route === location.pathname
  );
  const current = activeIndex === -1 ? 0 : activeIndex;

  // Константы для расчёта позиции индикатора (в px)
  const paddingLeft = 12;
  const buttonWidth = 48;
  const gap = 12;
  const indicatorWidth = 76;
  const buttonCenter = paddingLeft + current * (buttonWidth + gap) + buttonWidth / 2;
  const indicatorLeft = buttonCenter - indicatorWidth / 2 + 2;

  return (
    <div className={styles.navigation}>
      <div className={styles.navButtons}>
        {/* Индикатор активного раздела */}
        <div
          className={styles.activeIndicator}
          style={{ left: `${indicatorLeft}px` }}
        />
        {navigationItems.map((item) => (
          <NavButton
            key={item.route}
            img={item.icon}
            onClick={() => navigate(item.route)}
          />
        ))}
      </div>
    </div>
  );
};

export default Navigation;
