import React, { useState } from 'react';
import styles from './RaffleComponents.module.css';
import { FaCalendarAlt, FaGift, FaUsers } from 'react-icons/fa';
import UserTicketsInfo from './UserTicketsInfo';
import { RafflePrize, UserInfo } from '@/types/types';
import { GlowEffect } from '@/components/ui/glow-effect';
import TicketsSlider from './TicketsSlider';
import { getUserName } from '@/utils/getUserName';
import { Button } from '@/components/ui/button';

interface RaffleInfoProps {
  id: number;
  startTime: string;
  endTime?: string;
  thresholdReachedAt?: string | null;
  formatDate: (dateString: string) => string;
  prize: string;
  isActive: boolean;
  winner?: {
    id: number;
    username: string | null;
    telegramId: number | null;
  };
  totalParticipants?: number;
  timerActive: boolean;
  loading: boolean;
  rafflePrize: RafflePrize | null;
  totalTickets?: number;
  winningTicket?: number;
}

const RaffleInfo: React.FC<RaffleInfoProps> = ({ 
  endTime, 
  thresholdReachedAt,
  formatDate,  
  winner, 
  totalParticipants,
  isActive,
  timerActive,
  rafflePrize,
  totalTickets,
  winningTicket
}) => {

  const [showResult, setShowResult] = useState(false);
  const winnerName = winner ? getUserName(winner as UserInfo) : 'Astronaut #1';

  const handleShowResult = () => {
    if (!winningTicket) return;
    setShowResult(true);
  };

  // Компонент с выигрышным билетом
  const WinningTicketDisplay = () => (
        <div className='m-4'>
          <div 
            className={`${styles.sliderItem} ${styles.winningTicket} ${styles.pulseAnimation}`}
            data-ticket={winningTicket}
          >
            {winningTicket}
          </div>
        </div>
  );

  return (
    <div className='gap-1 p-4 text-center sm:text-left flex flex-col items-center justify-between relative'>

        <div className="flex flex-col items-center gap-2 w-full">
          { isActive && timerActive && thresholdReachedAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground pb-3">
                <>
                  <FaCalendarAlt />
                  <span>Start: {formatDate(thresholdReachedAt)}</span>
                </>
            </div>
          )}

          { isActive && !timerActive && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground pb-3">
              <span>Raffle has not yet started, minimum number of tickets to start: 50</span>
            </div>
          )}
          
          {endTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground pb-3">
              <FaCalendarAlt />
              <span>End: {formatDate(endTime)}</span>
            </div>
          )}
        </div>

        <>
          {rafflePrize && (
            <>
          <div className='relative'>
            <GlowEffect
                colors={['#4f9ee6', '#ebf0d1', '#dd6e42', '#2d3047']}
                mode='colorShift'
                blur='medium'
                duration={3}
                scale={0.9}
                className='rounded-[20px]'
              />
              <div className={styles.trophyContainer}>
              <img 
                src={rafflePrize?.imageUrl || ''} 
                alt={rafflePrize?.name || ''} 
                className={styles.trophyIcon} 
              />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
              <FaGift />
              <span>{rafflePrize.name}</span>
            </div>
            </>
          )}
          {!rafflePrize && (
            <>
            <div className='relative flex items-center justify-center flex-col'>
              <div className={styles.trophyContainer}>
                <img 
                  src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Symbols/Question%20Mark.webp" 
                  alt="Question Mark" 
                  className={styles.trophyIcon} 
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <FaGift />
                <span>You'll soon recognize the gift!</span>
              </div>
              </div>
            </>
          )}
          {/* Conditional rendering: either TicketsSlider or WinningTicket */}
          {showResult && winningTicket ? (
            <WinningTicketDisplay />
          ) : (
            <TicketsSlider totalTickets={totalTickets} />
          )}
        </>
        { isActive && (
          <UserTicketsInfo />
        )}
        
        {!isActive && winner && winningTicket && !showResult && (
          <Button 
            onClick={handleShowResult} 
            className={styles.showResultButton}
            variant='secondary'
          >
            See the result
          </Button>
        )}
        
        {winner && showResult && (
          <div className={styles.ticketsContainer}>
            <div className={styles.ticketsHeader}>
              <strong className={styles.ticketsLabel}>Winner</strong>
              <div className="flex items-center gap-2">
                <span>{winnerName}</span>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <FaUsers />
                <span>Total participants: {totalParticipants}</span>
              </p>
            </div>
          </div>
        )}
    </div>
  );
};

export default RaffleInfo;