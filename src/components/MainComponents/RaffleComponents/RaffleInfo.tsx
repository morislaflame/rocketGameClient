import React from 'react';
import InfiniteSlider from './InfiniteSlider';
import styles from './RaffleComponents.module.css';
import { FaCalendarAlt, FaUserAlt, FaUsers } from 'react-icons/fa';
import UserTicketsInfo from './UserTicketsInfo';

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
}

const RaffleInfo: React.FC<RaffleInfoProps> = ({ 
  startTime, 
  endTime, 
  formatDate,  
  winner, 
  totalParticipants,
  isActive,
  timerActive
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
          <img 
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Activity/1st%20Place%20Medal.webp" 
            alt="1st Place Medal" 
            className={styles.trophyIcon} 
          />
          <InfiniteSlider />
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