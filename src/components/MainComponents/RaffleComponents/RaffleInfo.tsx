import React from 'react';
import InfiniteSlider from './InfiniteSlider';
import styles from './RaffleComponents.module.css';

interface RaffleInfoProps {
  id: number;
  startTime: string;
  formatDate: (dateString: string) => string;
}

const RaffleInfo: React.FC<RaffleInfoProps> = ({ id, startTime, formatDate }) => {
  return (
    <div className='gap-1.5 p-4 text-center sm:text-left flex flex-col items-center justify-between'>
      <h2 className='text-3xl font-semibold leading-none tracking-tight'>Raffle #{id}</h2>
      <p className="text-sm text-muted-foreground">Start: {formatDate(startTime)}</p>
      <img 
        src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Activity/1st%20Place%20Medal.webp" 
        alt="1st Place Medal" 
        className={styles.trophyIcon} 
      />
      <InfiniteSlider />
    </div>
  );
};

export default RaffleInfo;