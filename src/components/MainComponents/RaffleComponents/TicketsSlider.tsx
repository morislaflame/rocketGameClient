import React, { useRef } from 'react';
import styles from './RaffleComponents.module.css';
import InfiniteSlider from '../../ui/infinite-slider';
import { getRaffleTicketImg } from '@/utils/getTicketImg';

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
      <img src={getRaffleTicketImg()} alt="Ticket" className={styles.ticketImg} />
      <span className={styles.ticketNumber}>{i + 1}</span>
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
    </div>
  );
};

export default TicketsSlider;