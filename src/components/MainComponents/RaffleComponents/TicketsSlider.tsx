import React, { useRef } from 'react';
import styles from './RaffleComponents.module.css';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import InfiniteSlider from '../../ui/infinite-slider';

interface TicketsSliderProps {
  items?: React.ReactNode[];
  totalTickets?: number;
}

const TicketsSlider: React.FC<TicketsSliderProps> = ({
  items,
  totalTickets,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Если элементы не переданы, используем числа от 1 до totalTickets (максимум 30)
  const itemCount = totalTickets ? Math.min(totalTickets, 30) : 20;
  const defaultItems = Array.from({ length: itemCount }, (_, i) => (
    <div 
      key={`default-${i}`} 
      className={styles.sliderItem}
      data-ticket={i + 1}
    >
      {i + 1}
    </div>
  ));
  
  const displayItems = items || defaultItems;
  
  // Определяем соответствующее направление для Motion InfiniteSlider
  const motionDirection = 'horizontal';
  
  // Преобразуем скорость в скорость Motion (чем выше число, тем быстрее)
  const motionSpeed = 20; 
  
  return (
    <div className={styles.sliderWrapper} ref={sliderRef}>
      <div className={styles.sliderContainer}>
        <InfiniteSlider 
          gap={16}
          speed={motionSpeed}
          direction={motionDirection}
          className={styles.sliderTrack}
        >
          {displayItems.map((item, index) => {
            const ticketNumber = index + 1;
            
            const props = { 
              key: `ticket-${index}`,
              className: styles.sliderItem
            };
            // Добавить атрибут отдельно
            (props as unknown as { 'data-ticket': string })['data-ticket'] = ticketNumber.toString();
            return React.cloneElement(item as React.ReactElement, props);
          })}
        </InfiniteSlider>
      </div>
      
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

export default TicketsSlider;