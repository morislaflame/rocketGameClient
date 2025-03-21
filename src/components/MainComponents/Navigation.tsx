import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavButton from '@/components/ui/NavButton';
import styles from './mainComponents.module.css';

import homeSolidIcon from "@/assets/HOME_SOLID2.png";
import astronautSolidIcon from "@/assets/ACC_SOLID.png";
import ticketSolidIcon from "@/assets/TICKET_SOLID.png";

import homeIcon from "@/assets/HOME_LINE.png";
import astronautIcon from "@/assets/ACC_LINE.png";
import ticketIcon from "@/assets/TICKET 1.png";

const navigationItems = [
  { 
    label: 'Home', 
    route: '/rocket', 
    icon: astronautIcon,
    solidIcon: astronautSolidIcon 
  },
  { 
    label: 'Raffle', 
    route: '/', 
    icon: ticketIcon,
    solidIcon: ticketSolidIcon 
  },
  { 
    label: 'User', 
    route: '/user-account', 
    icon: homeIcon,
    solidIcon: homeSolidIcon
  },
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
        {navigationItems.map((item, index) => (
          <NavButton
            key={item.route}
            img={
              <img 
                src={index === current ? item.solidIcon : item.icon} 
                alt={item.label}
                width={32}
                height={32}
                className='z-10'
              />
            }
            onClick={() => navigate(item.route)}
          />
        ))}
      </div>
    </div>
  );
};

export default Navigation;
