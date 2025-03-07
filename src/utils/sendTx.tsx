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

    const isConnectionRestored = tonConnectUI.connectionRestored;
    const isConnected = tonConnectUI.connected;

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
                    } else if (status.status === "error" || status.status === "unsuccessful") {
                        setTransactionStatus("error");
                        setErrorMessage(status.errorMessage || "Transaction failed");
                        clearInterval(interval);
                    }
                }
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [uniqueId, transactionStatus, raffle, user.user?.id]);

    const handleSendTx = async () => {
        setIsLoading(true);
        setTransactionStatus("pending");
        setErrorMessage(null);
        if (props.onTxStart) props.onTxStart();

        if (!isConnected) {
            await tonConnectUI.openModal();
            setIsLoading(false);
            setTransactionStatus(null);
            if (props.onTxComplete) props.onTxComplete("Connection error");
            return;
        }

        if (!isConnectionRestored) {
            console.error("Connection not restored. Please reconnect your wallet");
            setIsLoading(false);
            setTransactionStatus(null);
            if (props.onTxComplete) props.onTxComplete("Connection not restored. Please reconnect your wallet");
            return;
        }

        if (!user.user?.id) {
            console.error("User is not authenticated");
            setIsLoading(false);
            setTransactionStatus("error");
            setErrorMessage("Please log in to purchase tickets");
            if (props.onTxComplete) props.onTxComplete("Please log in");
            return;
        }

        try {
            const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const rawPayload = `${user.user.id}:${props.packageId}:raffleTicket:${uniqueId}`;

            await raffle.initRaffleTicketPurchase(user.user.id, props.packageId, rawPayload, uniqueId, props.bonusId);

            const payload = beginCell()
                .storeUint(0, 32)
                .storeStringTail(rawPayload)
                .endCell()
                .toBoc()
                .toString("base64");

            const result = await tonConnectUI.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 360,
                messages: [{
                    address: address,
                    amount: amount.toString(),
                    payload: payload
                }],
            });

            console.log("Transaction sent successfully:", result);
            setUniqueId(uniqueId);
        } catch (error) {
            console.error("Transaction error:", error);
            setTransactionStatus("error");
            setErrorMessage("Transaction failed");
            if (props.onTxComplete) props.onTxComplete("Transaction not sent");
        } finally {
            setIsLoading(false);
        }
    };

    // Уведомляем родительский компонент о завершении, но не закрываем диалог сразу
    useEffect(() => {
        if (transactionStatus === "success" || transactionStatus === "error") {
            if (props.onTxComplete) {
                props.onTxComplete(transactionStatus === "error" ? errorMessage || "Transaction failed" : undefined);
            }
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