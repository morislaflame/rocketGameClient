import React, { useRef, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import styles from './UserAccountComponents.module.css';
import gsap from 'gsap';

interface ExpandableCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  children: React.ReactNode;
  onOpen?: () => void;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({ 
  title, 
  icon, 
  description, 
  children,
  onOpen 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const toggleCard = () => {
    setIsOpen(!isOpen);
    if (!isOpen && onOpen) {
      onOpen();
    }
  };

  // Применение анимации при изменении статуса открытия
  useEffect(() => {
    if (contentRef.current) {
        const headerAnimation = gsap.timeline();

      if (isOpen) {
        headerAnimation.to(headerRef.current, {
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            duration: 0.5,
            ease: "power2.out"
          });
          
          headerAnimation.to(titleRef.current, {
            justifyContent: "center",
            duration: 0.4,
            ease: "power2.out"
          }, "<");

          headerAnimation.to(descriptionRef.current, {
            textAlign: "center",
            duration: 0.4, 
            ease: "power2.out"
          }, "<");
        // Установка начальных стилей перед анимацией открытия
        gsap.set(contentRef.current, { height: 0, opacity: 0, display: 'block' });
        // Запуск анимации открытия
        gsap.to(contentRef.current, {
          height: 'auto',
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        });
      } else {
        headerAnimation.to(headerRef.current, {
            justifyContent: "flex-start",
            alignItems: "flex-start",
            textAlign: "left",
            duration: 0.5,
            ease: "power2.inOut"
          });
          
          headerAnimation.to(titleRef.current, {
            justifyContent: "flex-start",
            duration: 0.4,
            ease: "power2.inOut"
          }, "<");
          
          headerAnimation.to(descriptionRef.current, {
            textAlign: "left",
            duration: 0.4,
            ease: "power2.inOut"
          }, "<");
        // Анимация закрытия
        gsap.to(contentRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => {
            if (contentRef.current) {
              contentRef.current.style.display = 'none';
            }
          },
        });
      }
    }
  }, [isOpen]);

  // Анимация клика
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
        onComplete: toggleCard
      });
    }
  };

  return (
    <div className={styles.cardContainer}>
      <Card className={styles.card} ref={cardContainerRef} onClick={handleClick}>
        <CardHeader className={styles.cardHeader} ref={headerRef}>
          <CardTitle className={styles.cardTitle} ref={titleRef}>
            {icon} {title}
          </CardTitle>
          <CardDescription className={styles.cardDescription} ref={descriptionRef}>
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
      <div 
        ref={contentRef} 
        style={{ display: 'none', overflow: 'hidden' }}
        className=""
      >
        {children}
      </div>
    </div>
  );
};

export default ExpandableCard;