import React from 'react';
import InfiniteSlider from './InfiniteSlider';
import styles from './RaffleComponents.module.css';
import { FaCalendarAlt, FaGift, FaUserAlt, FaUsers } from 'react-icons/fa';
import UserTicketsInfo from './UserTicketsInfo';
import { RafflePrize } from '@/types/types';

interface RaffleInfoProps {
  id: number;
  startTime: string;
  endTime?: string;
  formatDate: (dateString: string) => string;
  prize: string;
  isActive: boolean;
  winner?: {
    id: number;
    username: string;
    telegramId: string;
  };
  totalParticipants?: number;
  timerActive: boolean;
  loading: boolean;
  rafflePrize: RafflePrize | null;
  totalTickets?: number;
  winningTicket?: number;
}

const RaffleInfo: React.FC<RaffleInfoProps> = ({ 
  startTime, 
  endTime, 
  formatDate,  
  winner, 
  totalParticipants,
  isActive,
  timerActive,
  rafflePrize,
  totalTickets,
  winningTicket
}) => {
  return (
    <div className='gap-1 p-4 text-center sm:text-left flex flex-col items-center justify-between'>
        <div className="flex flex-col items-center gap-2 w-full">

        { isActive && timerActive && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <>
                <FaCalendarAlt />
                <span>Start: {formatDate(startTime)}</span>
              </>
          </div>
        )}

        { isActive && !timerActive && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Raffle has not yet started, minimum number of tickets to start: 50</span>
          </div>
        )}
        
        {endTime && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FaCalendarAlt />
            <span>End: {formatDate(endTime)}</span>
          </div>
        )}
      </div>
        <>
          {rafflePrize && (
            <>
              <img 
                src={rafflePrize?.imageUrl || ''} 
                alt={rafflePrize?.name || ''} 
                className={styles.trophyIcon} 
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FaGift />
                <span>{rafflePrize.name}</span>
              </div>
            </>
          )}
          {!rafflePrize && (
            <>
              <img 
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Symbols/Question%20Mark.webp" 
                alt="Question Mark" 
                className={styles.trophyIcon} 
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FaGift />
                <span>You'll soon recognize the gift!</span>
              </div>
            </>
          )}
          <InfiniteSlider 
            totalTickets={totalTickets} 
            winningTicket={winningTicket}
            isCompleted={!isActive && winner !== undefined} 
          />
        </>
        { isActive && (
          <UserTicketsInfo />
        )}
        {winner && (
          <div className={styles.ticketsContainer}>
            <div className={styles.ticketsHeader}>
              <strong className={styles.ticketsLabel}>Winner</strong>
              <div className="flex items-center gap-2">
                <FaUserAlt />
                <span>{winner.username}</span>
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