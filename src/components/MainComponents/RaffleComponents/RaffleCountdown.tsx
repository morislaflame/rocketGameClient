import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';

interface RaffleCountdownProps {
  startTime: string; // Время начала в формате ISO
  duration: number;  // Продолжительность в миллисекундах (4 часа = 4 * 60 * 60 * 1000)
}

const RaffleCountdown: React.FC<RaffleCountdownProps> = observer(({ startTime, duration }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const { t } = useTranslate();

  useEffect(() => {
    // Функция для форматирования времени
    const formatTimeLeft = (ms: number): string => {
      if (ms <= 0) {
        setIsExpired(true);
        return "Raffle ends...";
      }
      
      // Преобразуем миллисекунды в часы, минуты и секунды
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((ms % (1000 * 60)) / 1000);
      
      // Форматируем строку с временем
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    // Функция для расчета оставшегося времени
    const calculateTimeLeft = () => {
      const start = new Date(startTime).getTime();
      const end = start + duration;
      const now = new Date().getTime();
      const difference = end - now;
      
      setTimeLeft(formatTimeLeft(difference));
    };
    
    // Вызываем сразу для первоначального отображения
    calculateTimeLeft();
    
    // Устанавливаем интервал для обновления каждую секунду
    const intervalId = setInterval(calculateTimeLeft, 1000);
    
    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [startTime, duration]);
  
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <FaClock />
      <span>{isExpired ? timeLeft : `${t('ends_in')}: ${timeLeft}`}</span>
    </div>
  );
});

export default RaffleCountdown;