import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context, IStoreContext } from '@/store/StoreProvider';
import styles from './RaffleComponents.module.css';
import NoActiveRaffle from './NoActiveRaffle';
import RaffleInfo from './RaffleInfo';
import { Button } from '@/components/ui/button';
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";


const CurrentRaffle: React.FC = observer(() => {
  const { raffle } = useContext(Context) as IStoreContext;
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("current");
  const [prevLoading, setPrevLoading] = useState<boolean>(true);

  // Загрузка текущего розыгрыша
  useEffect(() => {
    const fetchCurrentData = async () => {
      setLoading(true);
      try {
        await raffle.fetchCurrentRaffle();
      } catch (error) {
        console.error('Error fetching current raffle:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "current") {
      fetchCurrentData();
      // Обновляем данные каждые 5 минут только для текущего розыгрыша
      const intervalId = setInterval(fetchCurrentData, 5 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [raffle, activeTab]);

  // Загрузка предыдущего розыгрыша
  useEffect(() => {
    const fetchPreviousData = async () => {
      setPrevLoading(true);
      try {
        await raffle.fetchPreviousRaffle();
      } catch (error) {
        console.error('Error fetching previous raffle:', error);
      } finally {
        setPrevLoading(false);
      }
    };

    if (activeTab === "previous") {
      fetchPreviousData();
    }
  }, [raffle, activeTab]);

  // Форматирование даты
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

  // Обработчик изменения активного таба
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Отображение текущего розыгрыша
  const renderCurrentRaffle = () => {
    // if (loading) {
    //   return <LoadingRaffle />;
    // }

    if (!raffle.currentRaffle) {
      return <NoActiveRaffle />;
    }

    const { raffle: currentRaffle } = raffle.currentRaffle;

    return (
      <div className={styles.raffleContainer}>
        <div className={styles.raffleHeader}>
          <Button
            variant={activeTab === "previous" ? "default" : "outline"}
            onClick={() => handleTabChange("previous")}
            className={styles.currentRaffleButton}
          >
            <FaArrowCircleLeft />
          </Button>
          <h2 className='text-3xl font-semibold leading-none tracking-tight relative'>
            Raffle #{currentRaffle.id}
          </h2>
        </div>
        <RaffleInfo 
          id={currentRaffle.id} 
          startTime={currentRaffle.startTime} 
          thresholdReachedAt={currentRaffle.thresholdReachedAt}
          formatDate={formatDate}
          prize={currentRaffle.prize}
          isActive={true}
          timerActive={currentRaffle.timerActive}
          loading={loading}
          rafflePrize={currentRaffle.raffle_prize}
          totalTickets={currentRaffle.totalTickets}
        />
        
      </div>
    );
  };

  // Отображение предыдущего розыгрыша
  const renderPreviousRaffle = () => {
    // if (prevLoading) {
    //   return <LoadingRaffle />;
    // }

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
        <div className={styles.raffleHeader}>
          <h2 className='text-3xl font-semibold leading-none tracking-tight'>
            Raffle #{prevRaffle.id}
          </h2>
          <Button
            variant={activeTab === "current" ? "default" : "outline"}
            onClick={() => handleTabChange("current")}
            className={styles.previousRaffleButton}
          >
            <FaArrowCircleRight />
          </Button>
        </div>
        <RaffleInfo 
          id={prevRaffle.id} 
          startTime={prevRaffle.startTime}
          endTime={prevRaffle.endTime || undefined}
          formatDate={formatDate}
          prize={prevRaffle.prize}
          isActive={false}
          timerActive={false}
          loading={prevLoading}
          winner={prevRaffle.winner || undefined}
          totalParticipants={raffle.previousRaffle.totalParticipants}
          rafflePrize={prevRaffle.raffle_prize}
          totalTickets={prevRaffle.totalTickets}
          winningTicket={prevRaffle.winningTicketNumber || undefined}
        />
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