import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './RaffleComponents.module.css';

interface InfiniteSliderProps {
  items?: React.ReactNode[];
  speed?: number;
  direction?: 'left' | 'right';
}

const InfiniteSlider: React.FC<InfiniteSliderProps> = ({
  items,
  speed = 20,
  direction = 'left',
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  
  // Если элементы не переданы, используем числа от 1 до 20
  const defaultItems = Array.from({ length: 20 }, (_, i) => (
    <div key={`default-${i}`} className={styles.sliderItem}>
      {i + 1}
    </div>
  ));
  
  const displayItems = items || defaultItems;
  
  // Дублируем элементы для создания бесконечного эффекта
  const duplicatedItems = [...displayItems, ...displayItems.map((item, index) => 
    React.cloneElement(item as React.ReactElement, { key: `duplicate-${index}` })
  )];
  
  useEffect(() => {
    if (!sliderTrackRef.current) return;
    
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
  }, [speed, direction, displayItems]);
  
  return (
    <div className={styles.sliderContainer} ref={sliderRef}>
      <div className={styles.sliderTrack} ref={sliderTrackRef}>
        {duplicatedItems}
      </div>
    </div>
  );
};

export default InfiniteSlider;