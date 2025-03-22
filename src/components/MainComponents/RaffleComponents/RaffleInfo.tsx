import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import styles from './RaffleComponents.module.css';
import { FaGift, FaPercentage, FaUsers } from 'react-icons/fa';
import UserTicketsInfo from './UserTicketsInfo';
import { RafflePrize, UserInfo } from '@/types/types';
import { GlowEffect } from '@/components/ui/glow-effect';
import TicketsSlider from './TicketsSlider';
import { getUserName } from '@/utils/getUserName';
import { Button } from '@/components/ui/button';
import questionImg from '@/assets/Question.png';
import { getRaffleTicketImg } from '@/utils/getTicketImg';

interface RaffleInfoProps {
  isActive: boolean;
  winner?: {
    id: number;
    username: string | null;
    telegramId: number | null;
  };
  totalParticipants?: number;
  rafflePrize: RafflePrize | null;
  totalTickets?: number;
  winningTicket?: number;
  winnerChance?: number;
}

const RaffleInfo: React.FC<RaffleInfoProps> = ({ 
  winner, 
  totalParticipants,
  isActive,
  rafflePrize,
  totalTickets,
  winningTicket,
  winnerChance
}) => {
  const [showResult, setShowResult] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const winnerName = winner ? getUserName(winner as UserInfo) : 'Astronaut #1';

  useEffect(() => {
    if (rafflePrize?.media_file?.mimeType === 'application/json') {
      fetch(rafflePrize.media_file.url)
        .then(response => response.json())
        .then(data => setAnimationData(data))
        .catch(error => console.error('Error loading animation:', error));
    }
  }, [rafflePrize]);

  const handleShowResult = () => {
    if (!winningTicket) return;
    setShowResult(true);
  };

  const WinningTicketDisplay = () => (
    <div className='m-1'>
      <div 
        className={`${styles.sliderItem} ${styles.winningTicket} ${styles.pulseAnimation}`}
        data-ticket={winningTicket}
      >
        <span className={styles.ticketNumber}>{winningTicket}</span>
        <img src={getRaffleTicketImg()} alt="Ticket" className={styles.ticketImg} />
      </div>
    </div>
  );

  const renderPrizeMedia = () => {
    if (rafflePrize?.media_file) {
      const { url, mimeType } = rafflePrize.media_file;
      if (mimeType === 'application/json' && animationData) {
        return (
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: '90%' }}
          />
        );
      } else if (mimeType.startsWith('image/')) {
        return <img src={url} alt={rafflePrize.name} className={styles.trophyIcon} />;
      }
    } else if (rafflePrize?.imageUrl) {
      return <img src={rafflePrize.imageUrl} alt={rafflePrize.name} className={styles.trophyIcon} />;
    }
    return <img src={questionImg} alt="No prize" className={styles.trophyIcon} />;
  };

  return (
    <div className='gap-2 text-center pt-3 pb-2 sm:text-left flex flex-col items-center justify-between relative w-full z-100'>
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
                {renderPrizeMedia()}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3">
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
                  src={questionImg} 
                  alt="Question Mark" 
                  className={styles.trophyIcon} 
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3">
                <FaGift />
                <span>You'll soon recognize the gift!</span>
              </div>
            </div>
          </>
        )}
        {showResult && winningTicket ? (
          <WinningTicketDisplay />
        ) : (
          <TicketsSlider totalTickets={totalTickets} />
        )}
      </>
      {isActive && (
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
            <p className="text-sm text-muted-foreground flex items-center gap-2 flex-col">
              <div className="flex items-center gap-2">
                <FaUsers />
                <span>Total participants: {totalParticipants}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPercentage />
                <span>Winner chance: {winnerChance}%</span>
              </div>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaffleInfo;