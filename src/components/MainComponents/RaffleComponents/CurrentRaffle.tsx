import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context, IStoreContext } from '@/store/StoreProvider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './RaffleComponents.module.css';
import { FaTicketAlt, FaTrophy } from 'react-icons/fa';
import TicketsDrawer from './TicketsDrawer';

const CurrentRaffle: React.FC = observer(() => {
  const { raffle, user } = useContext(Context) as IStoreContext;

  
//   const [timeLeft, setTimeLeft] = useState<string>('');
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

  // Обновляем оставшееся время каждую секунду
//   useEffect(() => {
//     if (!raffle.currentRaffle?.raffle?.endTime) return;

//     const calculateTimeLeft = () => {
//       const endTime = new Date(raffle.currentRaffle?.raffle?.endTime!).getTime();
//       const now = new Date().getTime();
//       const difference = endTime - now;

//       if (difference <= 0) {
//         setTimeLeft('Розыгрыш завершен');
//         return;
//       }

//       const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((difference % (1000 * 60)) / 1000);

//       let timeString = '';
//       if (days > 0) timeString += `${days}д `;
//       timeString += `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
//       setTimeLeft(timeString);
//     };

//     calculateTimeLeft();
//     const timerId = setInterval(calculateTimeLeft, 1000);
//     return () => clearInterval(timerId);
//   }, [raffle.currentRaffle]);

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
          <CardTitle>Нет активных розыгрышей</CardTitle>
          <CardDescription>В данный момент нет активных розыгрышей. Следите за обновлениями!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { raffle: currentRaffle, totalTickets } = raffle.currentRaffle;
  const userTickets = user.user?.tickets || 0;
  const ticketPercentage = totalTickets > 0 ? (userTickets / totalTickets) * 100 : 0;

  return (
    <div className={styles.raffleContainer}>
        <div className='gap-1.5 p-4 text-center sm:text-left flex flex-col items-center justify-between'>
            <h2 className='text-3xl font-semibold leading-none tracking-tight'>Raffle #{currentRaffle.id}</h2>
            
            <p className="text-sm text-muted-foreground">Buy tickets to participate in the raffle</p>
            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Activity/1st%20Place%20Medal.webp" alt="1st Place Medal" className={styles.trophyIcon} />
        </div>
        
            <Card className={styles.raffleCard}>
                <CardHeader>
                    <CardTitle className={styles.raffleTitle}>
            <FaTrophy className={styles.trophyIcon} />
            Текущий розыгрыш
            </CardTitle>
            <CardDescription>
            Начало: {formatDate(currentRaffle.startTime)}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className={styles.prizeContainer}>
            <h3 className={styles.prizeTitle}>Приз:</h3>
            <p className={styles.prizeValue}>{currentRaffle.prize}</p>
            </div>

            {/* <div className={styles.timeContainer}>
            <FaClock className={styles.clockIcon} />
            <div className={styles.timeInfo}>
                <p className={styles.timeLabel}>До окончания:</p>
                <p className={styles.timeValue}>{timeLeft}</p>
            </div>
            </div> */}

            <div className={styles.ticketsContainer}>
            <div className={styles.ticketsHeader}>
                <FaTicketAlt className={styles.ticketIcon} />
                <p className={styles.ticketsLabel}>Ваши билеты:</p>
                <p className={styles.ticketsValue}>{userTickets} из {totalTickets}</p>
            </div>
            <p className={styles.ticketsPercentage}>
                Ваш шанс на победу: {ticketPercentage.toFixed(2)}%
            </p>
            </div>
        </CardContent>
        <CardFooter className={styles.raffleFooter}>
            <TicketsDrawer />
        </CardFooter>
        </Card>
    </div>
  );
});

export default CurrentRaffle;