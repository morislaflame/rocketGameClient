// src/components/MainComponents/RaffleComponents/TicketsList.tsx
import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context, IStoreContext } from "@/store/StoreProvider";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { RafflePackage } from "@/types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "./RaffleComponents.module.css";
import ListSkeleton from "../ListSkeleton";
import SendTx from "@/utils/sendTx";
import TransactionAlert from "@/components/FunctionalComponents/TransactionAlert";
import { FaTicketAlt } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";

interface TicketsListProps {
  onTransactionClose?: () => void;
}

const TicketsList: React.FC<TicketsListProps> = observer(({ onTransactionClose }) => {
  const { raffle, user } = useContext(Context) as IStoreContext;
  const [alertVisible, setAlertVisible] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [txError, setTxError] = useState<string | null>(null);
  const [selectedBonuses, setSelectedBonuses] = useState<{ [key: number]: number | null }>({});

  useEffect(() => {
      loadRafflePackages();
      loadAvailableBonuses();
  }, [raffle, user]);

  const loadRafflePackages = async () => {
    setIsLoading(true);
    try {
      await raffle.fetchRafflePackages();
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading raffle packages:', error);
      setIsLoading(false);
    }
  }

  const loadAvailableBonuses = async () => {
    try {
      await user.fetchAvailableBonuses();
    } catch (error) {
      console.error('Error loading available bonuses:', error);
    }
  };

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
      // Не закрываем диалог автоматически при успехе, ждём действия TransactionAlert
  };

  const closeAlert = () => {
      if (!txLoading) {
          setAlertVisible(false);
          setTxError(null);
          if (onTransactionClose) onTransactionClose();
      }
  };

  const handleBonusToggle = (packageId: number, bonusId: number | null) => {
    setSelectedBonuses((prev) => ({
      ...prev,
      [packageId]: prev[packageId] === bonusId ? null : bonusId,
    }));
  };

  const hasAvailableBonus = user.availableBonuses.length > 0;

  if (raffle.rafflePackages.length === 0) {
      return <p>No tickets found</p>;
  }

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
                          <ListSkeleton count={10} />
                      ) : raffle.rafflePackages.length ? (
                          raffle.rafflePackages.map((p: RafflePackage) => (
                              <Card key={p.id} className={styles.ticketCard}>
                                  <CardHeader className={styles.ticketCardHeader}>
                                      <CardTitle className={styles.ticketCardTitle}>
                                          {p.name}
                                      </CardTitle>
                                      <CardDescription className={styles.ticketCardDescription}>
                                          +{p.ticketCount} <FaTicketAlt />
                                      </CardDescription>
                                  </CardHeader>
                                  <CardContent className={styles.ticketCardContent}>
                                    {hasAvailableBonus && (
                                        <div className={styles.bonusSection}>
                                            <span className={styles.bonusIcon}>x2</span>
                                            <Switch
                                            checked={!!selectedBonuses[p.id]}
                                            onCheckedChange={() =>
                                                handleBonusToggle(p.id, user.availableBonuses[0]?.id)
                                            }
                                            disabled={user.availableBonuses.length === 0}
                                            />
                                        </div>
                                    )}
                                      <SendTx 
                                          price={p.price} 
                                          packageId={p.id} 
                                          onTxStart={handleTxStart}
                                          onTxComplete={handleTxComplete}
                                          disabled={txLoading}
                                          bonusId={selectedBonuses[p.id] || undefined}
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