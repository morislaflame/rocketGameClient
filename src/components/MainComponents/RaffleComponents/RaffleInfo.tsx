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
import tonImg from "@/assets/TonIcon.svg";
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';
import { MediaRenderer } from '@/utils/media-renderer';
import { useAnimationLoader } from '@/utils/useAnimationLoader';

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

const RaffleInfo: React.FC<RaffleInfoProps> = observer(({ 
  winner, 
  totalParticipants,
  isActive,
  rafflePrize,
  totalTickets,
  winningTicket,
  winnerChance
}) => {
  const [showResult, setShowResult] = useState(false);
  const winnerName = winner ? getUserName(winner as UserInfo) : 'Astronaut #1';
  const { t } = useTranslate();
  
  const [animations] = useAnimationLoader(
    rafflePrize ? [rafflePrize] : [],
    (item) => item.media_file, 
    []
  );

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
    if (rafflePrize) {
      return (
        <MediaRenderer
          mediaFile={rafflePrize.media_file}
          imageUrl={rafflePrize.imageUrl}
          animations={animations}
          name={rafflePrize.name}
          className={styles.trophyIcon}
          loop={false}
        />
      );
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
            <div className="flex items-center flex-col gap-1 text-sm text-muted-foreground pt-3">
              <span className='flex items-center gap-2'>
                <FaGift />
                {rafflePrize.name || 'Unknown Prize'}
              </span>
              {rafflePrize.tonPrice !== undefined && (
                <span className='flex items-center gap-1'>
                  {typeof rafflePrize.tonPrice === 'number' 
                    ? rafflePrize.tonPrice.toFixed(1)
                    : Number(rafflePrize.tonPrice).toFixed(1)
                  } 
                  <img src={tonImg} alt="Ton" className='w-4 h-4' />
                </span>
              )}
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
                <span>{t('you_ll_soon_recognize_the_gift')}</span>
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
          {t('see_the_result')}
        </Button>
      )}
      
      {winner && showResult && (
        <div className={styles.ticketsContainer}>
          <div className={styles.ticketsHeader}>
            <strong className={styles.ticketsLabel}>{t('winner')}</strong>
            <div className="flex items-center gap-2">
              <span>{winnerName}</span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2 flex-col">
              <div className="flex items-center gap-2">
                <FaUsers />
                <span>{t('total_participants')}: {totalParticipants}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPercentage />
                <span>{t('winner_chance')}: {winnerChance}%</span>
              </div>
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

export default RaffleInfo;