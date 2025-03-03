import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './RaffleComponents.module.css';
import { Button } from '@/components/ui/button';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';

interface InfiniteSliderProps {
  items?: React.ReactNode[];
  speed?: number;
  direction?: 'left' | 'right';
  totalTickets?: number;
  winningTicket?: number;
  isCompleted?: boolean;
}

const InfiniteSlider: React.FC<InfiniteSliderProps> = ({
  items,
  speed = 20,
  direction = 'left',
  totalTickets,
  winningTicket,
  isCompleted = false,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const [showResult, setShowResult] = useState(false);
  
  // Если элементы не переданы, используем числа от 1 до totalTickets (максимум 30)
  const itemCount = totalTickets ? Math.min(totalTickets, 30) : 20;
  const defaultItems = Array.from({ length: itemCount }, (_, i) => (
    <div 
      key={`default-${i}`} 
      className={`${styles.sliderItem} ${winningTicket === i + 1 && showResult ? styles.winningTicket : ''}`}
    >
      {i + 1}
    </div>
  ));
  
  const displayItems = items || defaultItems;
  
  // Дублируем элементы для создания бесконечного эффекта
  const duplicatedItems = [...displayItems, ...displayItems.map((item, index) => 
    React.cloneElement(item as React.ReactElement, { key: `duplicate-${index}` })
  )];
  
  useEffect(() => {
    if (!sliderTrackRef.current || showResult) return;
    
    const track = sliderTrackRef.current;
    
    // Получаем ширину одного набора элементов (половина всех элементов)
    const halfTrackWidth = track.scrollWidth / 2;
    
    // Настраиваем анимацию
    const directionMultiplier = direction === 'left' ? -1 : 1;
    
    // Останавливаем предыдущие анимации
    gsap.killTweensOf(track);
    
    // Создаем бесконечную анимацию
    gsap.to(track, {
      x: directionMultiplier * halfTrackWidth,
      duration: halfTrackWidth / speed,
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        gsap.set(track, { x: 0 });
      }
    });
    
    return () => {
      gsap.killTweensOf(track);
    };
  }, [speed, direction, displayItems, showResult]);

  const handleShowResult = () => {
    if (!sliderTrackRef.current || !winningTicket) return;
    
    setShowResult(true);
    
    const track = sliderTrackRef.current;
    const container = sliderRef.current;
    
    if (!container) return;
    
    gsap.killTweensOf(track);
    
    // Находим ширину контейнера и элемента
    const containerWidth = container.offsetWidth;
    const itemWidth = 80; // Примерная ширина элемента включая margin
    
    // Вычисляем, насколько нужно сдвинуть слайдер, чтобы выигрышный билет оказался в центре
    const targetPosition = -(winningTicket * itemWidth - containerWidth / 2 + itemWidth / 2);
    
    // Создаем анимацию с эффектом "вращения и замедления"
    gsap.fromTo(track, 
      { x: 0 }, 
      { 
        x: targetPosition,
        duration: 3,
        ease: "power2.out", // Постепенное замедление
        onComplete: () => {
          // После остановки можно выделить выигрышный билет
          const winningElement = track.querySelector(`[data-ticket="${winningTicket}"]`);
          if (winningElement) {
            gsap.to(winningElement, {
              scale: 1.2,
              backgroundColor: "rgba(255, 215, 0, 0.5)",
              duration: 0.5,
              repeat: 2,
              yoyo: true
            });
          }
        }
      }
    );
  };
  
  return (
    <div className={styles.sliderWrapper}>
      {/* <div className={styles.sliderTrackLine}></div> */}
      <div className={styles.sliderContainer} ref={sliderRef}>
        <div className={styles.sliderTrack} ref={sliderTrackRef}>
          {duplicatedItems.map((item, index) => {
            const ticketNumber = 
              index < displayItems.length 
                ? index + 1 
                : index - displayItems.length + 1;
            
            const props = { 
              key: `ticket-${index}`,
              className: `${styles.sliderItem} ${
                ticketNumber === winningTicket && showResult ? styles.winningTicket : ''
              }`
            };
            // Добавить атрибут отдельно
            (props as unknown as { 'data-ticket': string })['data-ticket'] = ticketNumber.toString();
            return React.cloneElement(item as React.ReactElement, props);
          })}
        </div>
      </div>
      
      {isCompleted && winningTicket && !showResult && (
        <Button 
          onClick={handleShowResult} 
          className={styles.showResultButton}
        >
          See the result
        </Button>
      )}
      <ProgressiveBlur
        className='pointer-events-none absolute top-0 left-0 h-full w-[50px]'
        direction='left'
        blurIntensity={1}
      />
      <ProgressiveBlur
        className='pointer-events-none absolute top-0 right-0 h-full w-[50px]'
        direction='right'
        blurIntensity={1}
      />
    </div>
  );
};

export default InfiniteSlider;