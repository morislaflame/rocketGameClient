import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context, IStoreContext } from "@/store/StoreProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import styles from "./FunctionalComponents.module.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTicketSolidImg2 } from "@/utils/getTicketImg";

interface UserTicketsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserTicketsDialog: React.FC<UserTicketsDialogProps> = observer(({ 
  open, 
  onOpenChange,
}) => {
  const { raffle } = useContext(Context) as IStoreContext;
  const tickets = raffle.userTickets?.tickets || [];
  const loading = raffle.loadingUserTickets;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dailyRewardModal}>
        <DialogHeader>
          <DialogTitle>Your tickets</DialogTitle>
          <DialogDescription>
            All ticket numbers you purchased for this raffle
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className={styles.ticketsLoading}>Loading tickets...</div>
        ) : tickets.length > 0 ? (
          <ScrollArea className="h-[170px] w-full">
            <div className={styles.ticketsGrid}>
              {tickets.map((ticket) => (
                <div key={ticket.id} className={styles.ticketItem}>
                  <img src={getTicketSolidImg2()} alt="Ticket" className={styles.ticketImg} />
                  <span className={styles.ticketNumber}>{ticket.ticketNumber}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className={styles.noTickets}>
            You don't have tickets in this raffle yet
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});

export default UserTicketsDialog;