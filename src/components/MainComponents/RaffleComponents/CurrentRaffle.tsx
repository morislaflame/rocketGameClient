import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context, IStoreContext } from '@/store/StoreProvider';
import styles from './RaffleComponents.module.css';

import NoActiveRaffle from './NoActiveRaffle';
import RaffleInfo from './RaffleInfo';
import RaffleHeader from './RaffleHeader';
import LoadingRaffle from './LoadingRaffle';
import RaffleHistoryMorphingDialog from '@/components/FunctionalComponents/RaffleHistoryMorphingDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import NoPreviousRaffle from './NoPreviousRaffle';

const CurrentRaffle: React.FC = observer(() => {
  const { raffle } = useContext(Context) as IStoreContext;
  const [activeTab, setActiveTab] = useState<string>("current");

  // При переключении таба вызываем соответствующий метод загрузки
  useEffect(() => {
    if (activeTab === "current") {
      raffle.fetchCurrentRaffle();
      const intervalId = setInterval(() => {
        raffle.fetchCurrentRaffle();
      }, 5 * 60 * 1000);
      return () => clearInterval(intervalId);
    } else if (activeTab === "previous") {
      raffle.fetchPreviousRaffle();
    }
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const renderCurrentRaffle = () => {
    if (raffle.loadingCurrentRaffle) {
      return <LoadingRaffle />;
    }
    if (!raffle.currentRaffle) {
      return <NoActiveRaffle />;
    }

    const { raffle: currentRaffle } = raffle.currentRaffle;

    return (
      <div className={styles.raffleContainer}>
        <RaffleHeader
          raffleId={currentRaffle.id}
          isCurrent={true}
          isActive={true}
          timerActive={currentRaffle.timerActive}
          thresholdReachedAt={currentRaffle.thresholdReachedAt ?? undefined}
          endTime={currentRaffle.endTime || undefined}
          formatDate={formatDate}
          onTabChange={handleTabChange}
          ticketThreshold={currentRaffle.ticketThreshold}
          totalTickets={currentRaffle.totalTickets}
          raffleDuration={currentRaffle.raffleDuration}
        />
        <ScrollArea className="flex-1 w-full">
          <div className="flex flex-col gap-2 items-center justify-center">
            <RaffleInfo
              isActive={true}
              rafflePrize={currentRaffle.raffle_prize}
              totalTickets={currentRaffle.totalTickets}
            />
            <div>
              <RaffleHistoryMorphingDialog />
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  };

  const renderPreviousRaffle = () => {
    if (raffle.loadingPreviousRaffle) {
      return <LoadingRaffle />;
    }
    if (!raffle.previousRaffle || !raffle.previousRaffle.raffle) {
      return (
        <div className='w-full h-full flex items-center justify-center'>
          <NoPreviousRaffle />
        </div>
      );
    }

    const { raffle: prevRaffle } = raffle.previousRaffle;

    return (
      <div className={styles.raffleContainer}>
        <RaffleHeader
          raffleId={prevRaffle?.id}
          isCurrent={false}
          isActive={false}
          timerActive={false}
          thresholdReachedAt={null}
          endTime={prevRaffle?.endTime || undefined}
          formatDate={formatDate}
          onTabChange={handleTabChange}
        />
        <ScrollArea className={styles.scrollArea}>
          <div className="flex flex-col gap-2 items-center justify-center">
            <RaffleInfo
              isActive={false}
              winner={prevRaffle?.winner || undefined}
              totalParticipants={raffle.previousRaffle.totalParticipants}
              rafflePrize={prevRaffle?.raffle_prize}
              totalTickets={prevRaffle?.totalTickets}
              winningTicket={prevRaffle?.winningTicketNumber || undefined}
              winnerChance={prevRaffle?.winnerChance || 0}
            />
            <div>
              <RaffleHistoryMorphingDialog />
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <div className={styles.raffleTabs}>
      {activeTab === "current" ? renderCurrentRaffle() : renderPreviousRaffle()}
    </div>
  );
});

export default CurrentRaffle;
