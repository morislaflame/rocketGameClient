import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context, IStoreContext } from '@/store/StoreProvider';
import styles from './RaffleComponents.module.css';
import LoadingRaffle from './LoadingRaffle';
import NoActiveRaffle from './NoActiveRaffle';
import RaffleInfo from './RaffleInfo';
import UserTicketsInfo from './UserTicketsInfo';

const CurrentRaffle: React.FC = observer(() => {
  const { raffle } = useContext(Context) as IStoreContext;
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await raffle.fetchCurrentRaffle();
      } catch (error) {
        console.error('Error fetching current raffle:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [raffle]);

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

  if (loading) {
    return <LoadingRaffle />;
  }

  if (!raffle.currentRaffle) {
    return <NoActiveRaffle />;
  }

  const { raffle: currentRaffle } = raffle.currentRaffle;

  return (
    <div className={styles.raffleContainer}>
      <RaffleInfo 
        id={currentRaffle.id} 
        startTime={currentRaffle.startTime} 
        formatDate={formatDate} 
      />
      <UserTicketsInfo/>
    </div>
  );
});

export default CurrentRaffle;