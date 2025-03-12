import React, { useContext, useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { FaTicketAlt } from 'react-icons/fa';
import { Context, IStoreContext } from '@/store/StoreProvider';
import TicketsList from './TicketsList';
import styles from './RaffleComponents.module.css';
import UserTicketsDialog from '@/components/FunctionalComponents/UserTicketsDialog';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';

const UserTicketsInfo: React.FC = observer(() => {
  const { raffle } = useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isTicketsListOpen, setIsTicketsListOpen] = useState(false);
  const ticketsListRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (ticketsListRef.current) {
      if (isTicketsListOpen) {
        // Устанавливаем начальные стили перед анимацией открытия
        gsap.set(ticketsListRef.current, { height: 0, opacity: 0, display: 'block' });
        // Запускаем анимацию открытия
        gsap.to(ticketsListRef.current, {
          height: 'auto',
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        });
      } else {
        // Анимация закрытия
        gsap.to(ticketsListRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => {
            ticketsListRef.current!.style.display = 'none';
          },
        });
      }
    }
  }, [isTicketsListOpen]);

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

  const haveTickets = raffle.userTickets?.tickets?.length ?? 0 > 0;

  const handleTicketsClick = () => {
    setDialogOpen(true);
  };

  const toggleTicketsList = () => {
    setIsTicketsListOpen(!isTicketsListOpen);
  };

  return (
    <div className={styles.ticketsContainer}>
      {haveTickets ? (
        <div className={styles.ticketsHeader}>
          <FaTicketAlt className={styles.ticketIcon} />
          <strong
            className={styles.ticketsLabel}
            onClick={handleTicketsClick}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
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

      {/* Рендеринг TicketsList с анимацией */}
      <div ref={ticketsListRef} className={styles.ticketsListWrapper} style={{ display: 'none' }}>
        <TicketsList />
      </div>

      <Button className={styles.ticketsButton} onClick={toggleTicketsList}>
        <FaTicketAlt /> {isTicketsListOpen ? 'Close' : 'Buy Tickets'}
      </Button>

      <UserTicketsDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
});

export default UserTicketsInfo;