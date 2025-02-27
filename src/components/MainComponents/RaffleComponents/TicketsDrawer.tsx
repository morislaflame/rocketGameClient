import React, { useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Context, IStoreContext } from '@/store/StoreProvider';
import styles from './RaffleComponents.module.css';
import { FaTicketAlt } from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import TicketsList from './TicketsList';
import { Button } from '@/components/ui/button';

const TicketsDrawer: React.FC = observer(() => {
  const { raffle } = React.useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Вызываем fetchRafflePackages при открытии Drawer и устанавливаем состояние загрузки
  const handleTicketsOpen = useCallback(async () => {
    try {
      setIsLoading(true);
      await raffle.fetchRafflePackages();
    } catch (error) {
      console.error("Error during fetching raffle packages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [raffle]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          className={styles.ticketsButton}
          onClick={handleTicketsOpen}
          variant="secondary"
        >
          <FaTicketAlt /> Buy Tickets
        </Button>
      </DrawerTrigger>
      <DrawerContent className={styles.drawerContent}>
        <DrawerHeader>
          <DrawerTitle>Raffle Tickets</DrawerTitle>
          <DrawerDescription>
            Buy tickets for the raffle
          </DrawerDescription>
        </DrawerHeader>
        <TicketsList isLoading={isLoading} />
      </DrawerContent>
    </Drawer>
  );
});

export default TicketsDrawer;