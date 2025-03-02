import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { FaTicketAlt } from 'react-icons/fa';
import { Context, IStoreContext } from '@/store/StoreProvider';
import TicketsDrawer from './TicketsDrawer';
import styles from './RaffleComponents.module.css';

const UserTicketsInfo: React.FC = observer(() => {
  const { raffle } = useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUserTickets = async () => {
      setIsLoading(true);
      try {
        await raffle.fetchUserTickets();
      } catch (error) {
        console.error('Error fetching user tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserTickets();
  }, [raffle]);

  if (isLoading) {
    return (
      <div className={styles.ticketsContainer}>
        <div className={styles.ticketsHeader}>
          <FaTicketAlt className={styles.ticketIcon} />
          <strong className={styles.ticketsLabel}>Loading tickets information...</strong>
        </div>
      </div>
    );
  }

  // Проверяем наличие данных и билетов
  const haveTickets = raffle.userTickets?.tickets?.length ?? 0 > 0;
  
  return (
    <div className={styles.ticketsContainer}>
      {haveTickets ? (
        <div className={styles.ticketsHeader}>
          <FaTicketAlt className={styles.ticketIcon} />
          <strong className={styles.ticketsLabel}>
            Your tickets: {raffle.userTickets?.tickets.length} of {raffle.userTickets?.raffle.totalTickets}
          </strong>
          <p className="text-sm text-muted-foreground">
            Your chance to win: {raffle.userTickets?.chance}
          </p>
        </div>
      ) : (
        <div className={styles.ticketsHeader}>
          <FaTicketAlt className={styles.ticketIcon} />
          <strong className={styles.ticketsLabel}>You don't have tickets yet</strong>
          <p className="text-sm text-muted-foreground">
            Buy tickets to participate in the raffle
          </p>
        </div>
      )}
      <TicketsDrawer />
    </div>
  );
});

export default UserTicketsInfo;