// src/components/MainComponents/CasesComponents/SendCaseTx.tsx
import { Button } from "@/components/ui/button";
import { useTonConnectUI } from "@tonconnect/ui-react";
import tonImg from "@/assets/TonIcon.svg";
import styles from "@/components/MainComponents/CasesComponents/CasesComponents.module.css";
import { useState, useContext, useEffect } from "react";
import { Context, IStoreContext } from "@/store/StoreProvider";
import { beginCell } from "ton-core";

interface SendCaseTxProps {
  price: string;
  caseId: number;
  onTxStart?: () => void;
  onTxComplete?: (error?: string) => void;
  disabled?: boolean;
}

const SendCaseTx: React.FC<SendCaseTxProps> = (props) => {
  const [tonConnectUI] = useTonConnectUI();
  const { user, cases } = useContext(Context) as IStoreContext;

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
        const status = await cases.checkTransactionStatus(user.user?.id || 0, uniqueId);
        if (status) {
          if (status.status === "successful") {
            setTransactionStatus("success");
            await cases.fetchUserCases();
            await cases.fetchCases();
            clearInterval(interval);
            setUniqueId(null);
          } else if (status.status === "error" || status.status === "failed") {
            setTransactionStatus("error");
            setErrorMessage(status.errorMessage || "Transaction failed");
            clearInterval(interval);
            setUniqueId(null);
          }
        }
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [uniqueId, transactionStatus, cases, user.user?.id]);

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
      // Формат сообщения для кейса отличается от билетов
      const rawPayload = `${user.user.id}:case:${props.caseId}:${newUniqueId}`;

      // Инициализируем покупку кейса
      await cases.initCasePurchase(
        user.user.id,
        props.caseId,
        rawPayload,
        newUniqueId
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

      // Отмена транзакции
      if (newUniqueId) {
        try {
          await cases.cancelTransaction(user.user.id, newUniqueId, errorType);
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
        {isLoading || transactionStatus === "pending" ? "Processing..." : Number(props.price).toFixed(1)}
        {!isLoading && transactionStatus !== "pending" && (
          <img src={tonImg} alt="Ton" className={styles.tonIcon} />
        )}
      </Button>
    </div>
  );
};

export default SendCaseTx;