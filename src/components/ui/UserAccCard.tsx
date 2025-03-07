import React, { useRef, memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import styles from './MainUi.module.css';
import gsap from 'gsap';

interface UserAccCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  onClick?: () => void;
}

const UserAccCard: React.FC<UserAccCardProps> = memo(({ title, icon, description, onClick }) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (cardContainerRef.current) {
      gsap.to(cardContainerRef.current, {
        scale: 0.97,
        duration: 0.1,
        backgroundColor: "#2C2C2C",
        color: "#FFFFFF",
        ease: "power1.inOut",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          onClick?.();
        }
      });
    }
  };

  return (
      <Card className={styles.card} ref={cardContainerRef} onClick={handleClick}>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>
            {icon} {title}
          </CardTitle>
          <CardDescription className={styles.cardDescription}>
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
  );
});

export default UserAccCard;
