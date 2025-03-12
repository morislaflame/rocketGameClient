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
import { FaTicketAlt } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

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

  // Автоматическое скрытие статуса транзакции через 2 секунды при успешном завершении
  useEffect(() => {
    if (alertVisible && !txLoading && !txError) {
      const timeout = setTimeout(() => {
        closeAlert();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [alertVisible, txLoading, txError]);

  const loadRafflePackages = async () => {
    setIsLoading(true);
    try {
      await raffle.fetchRafflePackages();
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading raffle packages:", error);
      setIsLoading(false);
    }
  };

  const loadAvailableBonuses = async () => {
    try {
      await user.fetchAvailableBonuses();
    } catch (error) {
      console.error("Error loading available bonuses:", error);
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
    // Статус транзакции остаётся видимым до закрытия (автоматически или вручную)
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
      {alertVisible && (
        <div
          className="flex flex-col items-center gap-2 w-full h-full bg-black/50 rounded-md p-4 border border-white/10 mb-3"
        >
          {txLoading ? (
            <div className="flex flex-col items-center gap-2">
              <AiOutlineLoading3Quarters size={48} className={styles.spinningIcon} />
              <p>Transaction in process... Please wait.</p>
            </div>
          ) : txError ? (
            <div className="flex flex-col items-center gap-2">
              <IoMdClose size={48} color="red" />
              <p>Error: {txError}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <IoIosCheckmarkCircle size={48} color="green" />
              <p>Transaction completed successfully!</p>
            </div>
          )}
          {!txLoading && <button onClick={closeAlert}>Close</button>}
        </div>
      )}
      {/* {!alertVisible && ( */}
     
      <ScrollArea className="h-[40vh] w-[100%] rounded-md" scrollHideDelay={1000}>
        <div className={styles.ticketsList}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
            {isLoading ? (
              <ListSkeleton count={10} />
            ) : raffle.rafflePackages.length ? (
              raffle.rafflePackages.map((p: RafflePackage) => (
                <Card key={p.id} className="flex flex-row justify-between p-4">
                  <CardHeader className="flex flex-col gap-1 p-0">
                    <CardTitle className="text-m font-bold flex flex-row gap-4 items-center">
                      {p.name}
                      {hasAvailableBonus && p.id <= 6 && (
                        <div className="flex flex-row gap-1 items-center">
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
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground flex flex-row gap-2 items-center">
                      +{p.ticketCount} <FaTicketAlt />
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-row gap-2 items-center p-0">
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
      {/* )} */}
    </>
  );
});

export default TicketsList;
