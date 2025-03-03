import React from 'react';
import { observer } from 'mobx-react-lite';
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

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          className={styles.ticketsButton}
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
        <TicketsList isLoading={false} />
      </DrawerContent>
    </Drawer>
  );
});

export default TicketsDrawer;