import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context, IStoreContext } from '@/store/StoreProvider';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './RaffleComponents.module.css';
import InfiniteSlider from './InfiniteSlider';
import { FaTicketAlt } from 'react-icons/fa';
import TicketsDrawer from './TicketsDrawer';

const CurrentRaffle: React.FC = observer(() => {
  const { raffle, user } = useContext(Context) as IStoreContext;
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

    // Обновляем данные каждые 5 минут
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
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
    return (
      <Card className={styles.raffleCard}>
        <CardHeader>
          <CardTitle className={styles.loadingTitle}>Загрузка розыгрыша...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!raffle.currentRaffle) {
    return (
      <Card className={styles.raffleCard}>
        <CardHeader>
          <CardTitle>No active raffles</CardTitle>
          <CardDescription>No active raffles, follow updates!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { raffle: currentRaffle, totalTickets } = raffle.currentRaffle;
  const userTickets = user.user?.tickets || 0;
  const ticketPercentage = totalTickets > 0 ? (userTickets / totalTickets) * 100 : 0;

  const haveTickets = userTickets > 0;

  return (
    <div className={styles.raffleContainer}>
        <div className='gap-1.5 p-4 text-center sm:text-left flex flex-col items-center justify-between'>
            <h2 className='text-3xl font-semibold leading-none tracking-tight'>Raffle #{currentRaffle.id}</h2>
            
            <p className="text-sm text-muted-foreground">Start: {formatDate(currentRaffle.startTime)}</p>
            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Activity/1st%20Place%20Medal.webp" alt="1st Place Medal" className={styles.trophyIcon} />
            <InfiniteSlider />
        </div>
        <div className={styles.ticketsContainer}>
            {haveTickets ? (
            <div className={styles.ticketsHeader}>
                <FaTicketAlt className={styles.ticketIcon} />
                <strong className={styles.ticketsLabel}>Your tickets: {userTickets} of {totalTickets}</strong>
                <p className="text-sm text-muted-foreground">
                    Your chance to win: {ticketPercentage.toFixed(2)}%
                </p>
            </div>
            ) : (
                <div className={styles.ticketsHeader}>
                    <FaTicketAlt className={styles.ticketIcon} />
                    <strong className={styles.ticketsLabel}>You don't have any tickets yet</strong>
                    <p className="text-sm text-muted-foreground">Buy tickets to participate in the raffle</p>
                </div>
            )}
            <TicketsDrawer />
        </div>
        
    </div>
  );
});

export default CurrentRaffle;