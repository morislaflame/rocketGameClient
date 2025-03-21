import { Button } from "@/components/ui/button";
import { useTonConnectUI } from "@tonconnect/ui-react";
import tonImg from "@/assets/TonIcon.svg";
import styles from "@/components/MainComponents/RaffleComponents/RaffleComponents.module.css";
import { useState, useContext, useEffect } from "react";
import { Context, IStoreContext } from "@/store/StoreProvider";
import { beginCell } from "ton-core";

interface SendTxProps {
  price: string;
  packageId: number;
  onTxStart?: () => void;
  onTxComplete?: (error?: string) => void;
  disabled?: boolean;
  bonusId?: number;
}

const SendTx: React.FC<SendTxProps> = (props) => {
  const [tonConnectUI] = useTonConnectUI();
  const { user, raffle } = useContext(Context) as IStoreContext;

  const address = import.meta.env.VITE_TON_ADDRESS;
  const amount = Number(props.price) * 1000000000;

  const [isLoading, setIsLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<"pending" | "success" | "error" | null>(null);
  const [uniqueId, setUniqueId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (uniqueId && transactionStatus === "pending") {
      interval = setInterval(async () => {
        const status = await raffle.checkTransactionStatus(user.user?.id || 0, uniqueId);
        if (status) {
          if (status.status === "successful") {
            setTransactionStatus("success");
            await raffle.fetchUserTickets();
            await raffle.fetchCurrentRaffle();
            clearInterval(interval);
            setUniqueId(null);
          } else if (status.status === "error" || status.status === "unsuccessful") {
            setTransactionStatus("error");
            setErrorMessage(status.errorMessage || "Transaction failed");
            clearInterval(interval);
            setUniqueId(null);
          }
        }
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [uniqueId, transactionStatus, raffle, user.user?.id]);

  const handleSendTx = async () => {
    if (!tonConnectUI.connected) {
      await tonConnectUI.openModal();
      if (!tonConnectUI.connected) {
        return;
      }
    }
    if (!tonConnectUI.connectionRestored) {
      console.error("Connection not restored. Please reconnect your wallet");
      return;
    }
    if (!user.user?.id) {
      console.error("User is not authenticated");
      if (props.onTxComplete) props.onTxComplete("Please log in");
      return;
    }

    setIsLoading(true);
    setTransactionStatus("pending");
    setErrorMessage(null);
    setUniqueId(null);
    if (props.onTxStart) props.onTxStart();

    let newUniqueId;

    try {
      newUniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const rawPayload = `${user.user.id}:${props.packageId}:raffleTicket:${newUniqueId}`;

      await raffle.initRaffleTicketPurchase(
        user.user.id,
        props.packageId,
        rawPayload,
        newUniqueId,
        props.bonusId
      );

      const payload = beginCell()
        .storeUint(0, 32)
        .storeStringTail(rawPayload)
        .endCell()
        .toBoc()
        .toString("base64");

      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: address,
            amount: amount.toString(),
            payload: payload,
          },
        ],
      });

      console.log("Transaction sent successfully:", result);
      setUniqueId(newUniqueId);
    } catch (error) {
      console.error("Transaction error:", error);
      setTransactionStatus("error");
    setErrorMessage("Transaction failed");

    let errorType = "unknown";
    if (error instanceof Error && error.name === "_TonConnectUIError") errorType = "_TonConnectUIError";
    else if (error instanceof Error && error.name === "_UserRejectsError") errorType = "_UserRejectsError";

    // Отмена транзакции с использованием newUniqueId
    if (newUniqueId) {
      try {
        await raffle.cancelTransaction(user.user.id, newUniqueId, errorType);
      } catch (cancelError) {
        console.error("Error cancelling transaction:", cancelError);
      }
    }

    if (props.onTxComplete) props.onTxComplete("Transaction not sent");
  } finally {
    setIsLoading(false);
  }
  };

  useEffect(() => {
    if (transactionStatus === "success" || transactionStatus === "error") {
      if (props.onTxComplete) {
        props.onTxComplete(
          transactionStatus === "error" ? errorMessage || "Transaction failed" : undefined
        );
      }
      setTransactionStatus(null);
    }
  }, [transactionStatus, errorMessage, props]);

  return (
    <div>
      <Button
        onClick={handleSendTx}
        disabled={isLoading || props.disabled}
        variant="secondary"
        style={{
          minWidth: "90px",
          border: "1px solid hsl(0deg 0.67% 27.27%)",
        }}
      >
        {isLoading || transactionStatus === "pending" ? "Processing..." : props.price}
        {!isLoading && transactionStatus !== "pending" && (
          <img src={tonImg} alt="Ton" className={styles.ticketCardTon} />
        )}
      </Button>
    </div>
  );
};

export default SendTx;