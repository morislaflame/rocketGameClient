import React, { useContext, useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader,
  DialogTitle, 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "./FunctionalComponents.module.css";
import { Context, IStoreContext } from '@/store/StoreProvider';
import ListSkeleton from '../MainComponents/ListSkeleton';
import { getPlanetImg } from "@/utils/getPlanetImg";
import { UserInfo } from "@/types/types";
import { getUserName } from "@/utils/getUserName";

interface RaffleHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RaffleHistoryDialog: React.FC<RaffleHistoryDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { raffle } = useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  
  useEffect(() => {
    const loadRaffleHistory = async () => {
      if (!open) return;
      
      setIsLoading(true);
      
      // Показываем лоадер только если загрузка идёт дольше 1 секунды
      const timerId = setTimeout(() => {
        setShowLoader(true);
      }, 1000);
      
      try {
        await raffle.fetchRaffleHistory();
      } catch (error) {
        console.error("Ошибка при загрузке истории розыгрышей:", error);
      } finally {
        clearTimeout(timerId);
        setIsLoading(false);
        setShowLoader(false);
      }
    };
    
    loadRaffleHistory();
  }, [open, raffle]);

  const tokenImg = getPlanetImg();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.raffleHistoryModal}>
        <DialogHeader>
          <DialogTitle>Raffle History</DialogTitle>
          <DialogDescription>
            List of all past raffles
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[50vh] w-full rounded-md">
          {isLoading && showLoader ? (
            <ListSkeleton count={5} />
          ) : raffle.raffleHistory && Array.isArray(raffle.raffleHistory) && raffle.raffleHistory.length > 0 ? (
            <div className={styles.raffleHistoryList}>
              {raffle.raffleHistory.map((item) => (
                <div key={item.id} className={styles.raffleHistoryItem}>
                  <div className={styles.raffleHistoryItemHeader}>
                    <div className={styles.prizeImageContainer}>
                        <img 
                          src={item.raffle_prize?.imageUrl || tokenImg} 
                          alt={item.raffle_prize?.name || ''}
                          className={styles.prizeImage}
                        />
                    </div>
                    <h3 className={styles.raffleHistoryItemTitle}>
                      {item.raffle_prize ? item.raffle_prize.name : item.prize}
                    </h3>
                  </div>
                    <div className={styles.raffleHistoryItemDetails}>
                        <h4 className="text-xl font-semibold leading-none tracking-tight pb-2">Raffle #{item.id}</h4>
                      <p className="font-semibold leading-none tracking-tight pb-2">Winner: {getUserName(item.winner as unknown as UserInfo)}</p>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-muted-foreground">Winning ticket: #{item.winningTicketNumber || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Total tickets: {item.totalTickets || 0}</p>
                        <p className="text-sm text-muted-foreground">Winner chance: {item.winnerChance || 0}%</p>
                      </div>
                      
                    </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyHistory}>
              <p>Raffle history is empty</p>
            </div>
          )}
        </ScrollArea>
        
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RaffleHistoryDialog;