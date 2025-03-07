import React, { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button 
          className={styles.ticketsButton}
          // variant="secondary"
          onClick={() => setIsOpen(true)}
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
        <TicketsList onTransactionClose={handleClose} />
      </DrawerContent>
    </Drawer>
  );
});

export default TicketsDrawer;