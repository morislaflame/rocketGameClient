import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context, IStoreContext } from '@/store/StoreProvider';
import styles from './RaffleComponents.module.css';

import NoActiveRaffle from './NoActiveRaffle';
import RaffleInfo from './RaffleInfo';
import RaffleHeader from './RaffleHeader';    // <-- Импортируем наш новый компонент
import { Button } from '@/components/ui/button';
import LoadingRaffle from './LoadingRaffle';
import RaffleHistoryDialog from '@/components/FunctionalComponents/RaffleHistoryDialog';

const CurrentRaffle: React.FC = observer(() => {
  const { raffle } = useContext(Context) as IStoreContext;
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("current");
  const [prevLoading, setPrevLoading] = useState<boolean>(true);
  const [showPrevLoader, setShowPrevLoader] = useState<boolean>(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState<boolean>(false);

  // Загрузка текущего розыгрыша
  useEffect(() => {
    const fetchCurrentData = async () => {
      setLoading(true);
      
      // Устанавливаем таймер на 1 секунду для отображения лоадера
      const timerId = setTimeout(() => {
        setShowLoader(true);
      }, 1000);
      
      try {
        await raffle.fetchCurrentRaffle();
      } catch (error) {
        console.error('Error fetching current raffle:', error);
      } finally {
        clearTimeout(timerId); // Очищаем таймер
        setLoading(false);
        setShowLoader(false);
      }
    };

    if (activeTab === "current") {
      fetchCurrentData();
      const intervalId = setInterval(fetchCurrentData, 5 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [raffle, activeTab]);

  // Загрузка предыдущего розыгрыша
  useEffect(() => {
    const fetchPreviousData = async () => {
      setPrevLoading(true);
      
      // Устанавливаем таймер на 1 секунду для отображения лоадера
      const timerId = setTimeout(() => {
        setShowPrevLoader(true);
      }, 1000);
      
      try {
        await raffle.fetchPreviousRaffle();
      } catch (error) {
        console.error('Error fetching previous raffle:', error);
      } finally {
        clearTimeout(timerId); // Очищаем таймер
        setPrevLoading(false);
        setShowPrevLoader(false);
      }
    };

    if (activeTab === "previous") {
      fetchPreviousData();
    }
  }, [raffle, activeTab]);

  // Функция форматирования даты
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

  // Переключение табов (current <-> previous)
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Отображение текущего розыгрыша
  const renderCurrentRaffle = () => {
    if (loading && showLoader) {
      return <LoadingRaffle />;
    }
    if (!raffle.currentRaffle) {
      return <NoActiveRaffle />;
    }

    const { raffle: currentRaffle } = raffle.currentRaffle;

    return (
      <div className={styles.raffleContainer}>
        {/* Вот здесь используем RaffleHeader */}
        <RaffleHeader
          raffleId={currentRaffle.id}
          isCurrent={true}
          isActive={true}
          timerActive={currentRaffle.timerActive}
          thresholdReachedAt={currentRaffle.thresholdReachedAt ?? undefined}
          endTime={currentRaffle.endTime || undefined}
          formatDate={formatDate}
          onTabChange={handleTabChange}  // передаём коллбэк переключения табов
        />

        {/* Тот же RaffleInfo */}
        <RaffleInfo
          isActive={true}
          rafflePrize={currentRaffle.raffle_prize}
          totalTickets={currentRaffle.totalTickets}
        />
        <div>
          <Button variant="outline" onClick={() => setHistoryDialogOpen(true)}>Raffle History</Button>
          <RaffleHistoryDialog 
            open={historyDialogOpen}
            onOpenChange={setHistoryDialogOpen}
          />
        </div>
      </div>
    );
  };

  // Отображение предыдущего розыгрыша
  const renderPreviousRaffle = () => {
    if (prevLoading && showPrevLoader) {
      return <LoadingRaffle />;
    }
    if (!raffle.previousRaffle) {
      return (
        <div className={styles.noRaffleContainer}>
          <p className={styles.noRaffleText}>No data about previous raffles</p>
        </div>
      );
    }

    const { raffle: prevRaffle } = raffle.previousRaffle;

    return (
      <div className={styles.raffleContainer}>
        {/* Для прошлого розыгрыша указываем isCurrent={false} */}
        <RaffleHeader
          raffleId={prevRaffle.id}
          isCurrent={false}
          isActive={false}
          timerActive={false}
          thresholdReachedAt={null}
          endTime={prevRaffle.endTime || undefined}
          formatDate={formatDate}
          onTabChange={handleTabChange}
        />

        <RaffleInfo
          isActive={false}
          winner={prevRaffle.winner || undefined}
          totalParticipants={raffle.previousRaffle.totalParticipants}
          rafflePrize={prevRaffle.raffle_prize}
          totalTickets={prevRaffle.totalTickets}
          winningTicket={prevRaffle.winningTicketNumber || undefined}
        />
        <div>
          <Button variant="outline" onClick={() => setHistoryDialogOpen(true)}>Raffle History</Button>
          <RaffleHistoryDialog 
            open={historyDialogOpen}
            onOpenChange={setHistoryDialogOpen}
          />
        </div>
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
