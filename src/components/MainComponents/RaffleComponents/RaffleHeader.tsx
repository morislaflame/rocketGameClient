import React from 'react';
import { Button } from '@/components/ui/button';
import { FaCalendarAlt, FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import styles from './RaffleComponents.module.css';
import RaffleCountdown from './RaffleCountdown';

interface RaffleHeaderProps {
  raffleId: number;
  isCurrent: boolean;               // определяет, показываем ли это для current-рафла или предыдущего
  isActive: boolean;
  timerActive: boolean;
  thresholdReachedAt?: string | null;
  endTime?: string;                 
  formatDate: (dateString: string) => string;
  onTabChange: (tab: 'current' | 'previous') => void;  // коллбэк для переключения вкладок
  ticketThreshold?: number;         // Новое поле - минимальное количество билетов для активации таймера
  totalTickets?: number;            // Новое поле - текущее количество билетов
  raffleDuration?: number;          // Новое поле - продолжительность розыгрыша в мс
}

const RaffleHeader: React.FC<RaffleHeaderProps> = ({
  raffleId,
  isCurrent,
  isActive,
  timerActive,
  thresholdReachedAt,
  endTime,
  formatDate,
  onTabChange,
  ticketThreshold = 50,  // Значение по умолчанию
  totalTickets = 0,      // Значение по умолчанию
  raffleDuration = 4 * 60 * 60 * 1000, // Значение по умолчанию - 4 часа
}) => {
  return (
    <div className="flex flex-col w-full gap-2 ">
      {/* Верхняя строка: кнопка переключения и заголовок */}
      <div className="flex items-center justify-center relative gap-2 flex-col">
        {isCurrent ? (
          // Если это current raffle – показываем кнопку для перехода на previous
          <Button variant="outline" onClick={() => onTabChange('previous')} className={styles.currentRaffleButton}>
            <FaArrowCircleLeft />
          </Button>
        ) : (
          // И наоборот, если это previous – переключаемся на current
          <Button variant="outline" onClick={() => onTabChange('current')} className={styles.previousRaffleButton}>
            <FaArrowCircleRight />
          </Button>
        )}

        {/* Заголовок */}
        <h2 className="text-3xl font-semibold leading-none tracking-tight">
          Raffle #{raffleId}
        </h2>

        
      </div>

      {/* Блок с датами и таймером */}
      <div className="flex flex-col items-center gap-2 text-center w-[70%] mx-auto">
        {isActive && timerActive && thresholdReachedAt && (
          <>
            {/* Отображаем обратный отсчет, если таймер активен */}
            <RaffleCountdown 
              startTime={thresholdReachedAt} 
              duration={raffleDuration} 
            />
          </>
        )}

        {isActive && !timerActive && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {totalTickets}/{ticketThreshold} tickets to start the raffle
            </span>
          </div>
        )}

        {endTime && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FaCalendarAlt />
            <span>End: {formatDate(endTime)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaffleHeader;
