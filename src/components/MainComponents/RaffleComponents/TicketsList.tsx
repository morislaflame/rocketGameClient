// src/components/MainComponents/RaffleComponents/TicketsList.tsx
import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context, IStoreContext } from "@/store/StoreProvider";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { RafflePackage } from "@/types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "./RaffleComponents.module.css";
import ListSkeleton from "../ListSkeleton";
import ticketImg from "@/assets/rocket.svg";
import SendTx from "@/utils/sendTx";
import TransactionAlert from "@/components/FunctionalComponents/TransactionAlert";

interface TicketsListProps {
  isLoading: boolean;
  onTransactionClose?: () => void;
}

const TicketsList: React.FC<TicketsListProps> = observer(({ isLoading, onTransactionClose }) => {
  const { raffle } = useContext(Context) as IStoreContext;
  const [txLoading, setTxLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  useEffect(() => {
    raffle.fetchRafflePackages();
  }, [raffle]);

  const handleTxStart = () => {
    setTxLoading(true);
    setTxError(null);
    setAlertVisible(true);
  };

  const handleTxComplete = (error?: string) => {
    setTxLoading(false);
    if (error) {
      setTxError(error);
    }
  };

  const closeAlert = () => {
    if (!txLoading) {
      setAlertVisible(false);
      setTxError(null);
      
      // Если транзакция успешна (нет ошибки) и пользователь закрыл alert вручную,
      // закрываем drawer
      if (!txError && onTransactionClose) {
        onTransactionClose();
      }
    }
  };

  if (raffle.rafflePackages.length === 0) {
    return <p>Билеты не найдены</p>;
  }
  
  const ticketIconImg = <img src={ticketImg} alt="Tickets" style={{ width: '24px', height: '24px' }} />;

  return (
    <>
      <TransactionAlert 
        showAlert={alertVisible} 
        onClose={closeAlert} 
        loading={txLoading} 
        error={txError}
      />
      <ScrollArea className="h-[70vh] w-[100%] rounded-md" scrollHideDelay={1000}>
        <div className={styles.ticketsList}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
            {isLoading ? (
              <ListSkeleton count={5}/>
            ) : raffle.rafflePackages.length ? (
              raffle.rafflePackages.map((p: RafflePackage) => (
                <Card key={p.id} className={styles.ticketCard}>
                  <CardHeader className={styles.ticketCardHeader}>
                    <CardTitle className={styles.ticketCardTitle}>
                      {p.name}
                    </CardTitle>
                    <CardDescription className={styles.ticketCardDescription}>
                      +{p.ticketCount} Tickets {ticketIconImg}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className={styles.ticketCardContent}>
                    <SendTx 
                      price={p.price} 
                      packageId={p.id} 
                      onTxStart={handleTxStart}
                      onTxComplete={handleTxComplete}
                      disabled={txLoading}
                    />
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No tickets found</p>
            )}
          </div>
        </div>
      </ScrollArea>
    </>
  );
});

export default TicketsList;