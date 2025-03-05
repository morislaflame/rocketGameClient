import { Button } from "@/components/ui/button";
import { useTonConnectUI } from "@tonconnect/ui-react";
import tonImg from "@/assets/TonIcon.svg";
import styles from "@/components/MainComponents/RaffleComponents/RaffleComponents.module.css";
import { useState, useContext } from "react";
import { Context, IStoreContext } from "@/store/StoreProvider";
import { beginCell } from "ton-core";

interface SendTxProps {
    price: string;
    packageId: number;
    onTxStart?: () => void;
    onTxComplete?: (error?: string) => void;
    disabled?: boolean;
}

const SendTx: React.FC<SendTxProps> = (props) => {
    const [tonConnectUI] = useTonConnectUI();
    const { user, raffle } = useContext(Context) as IStoreContext;

    const isConnectionRestored = tonConnectUI.connectionRestored;
    const isConnected = tonConnectUI.connected;

    const address = import.meta.env.VITE_TON_ADDRESS;
    const amount = Number(props.price) * 1000000000;

    const [isLoading, setIsLoading] = useState(false);

    const handleSendTx = async () => {
        setIsLoading(true);
        if (props.onTxStart) props.onTxStart();

        if (!isConnected) {
            await tonConnectUI.openModal();
            setIsLoading(false);
            if (props.onTxComplete) props.onTxComplete("Connection error");
            return;
        }

        if (!isConnectionRestored) {
            console.error("Connection not restored. Please reconnect your wallet");
            setIsLoading(false);
            if (props.onTxComplete) props.onTxComplete("Connection not restored. Please reconnect your wallet");
            return;
        }

        try {
            // Создаем уникальный идентификатор (timestamp + случайное число)
            const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            // Создаем сырой payload в текстовом формате
            const rawPayload = `${user.user?.id || 0}:${props.packageId}:raffleTicket:${uniqueId}`;

            // Инициируем покупку на бэкенде
            await raffle.initRaffleTicketPurchase(
                user.user?.id || 0,
                props.packageId,
                rawPayload,
                uniqueId
            );

            // Создаем BOC payload для транзакции
            const payload = beginCell()
                .storeUint(0, 32) // Маркер операции (0)
                .storeStringTail(rawPayload) // Формат "userId:packageId:тип:уникальныйИД"
                .endCell()
                .toBoc()
                .toString("base64");

            // Отправляем транзакцию через TON Connect
            const result = await tonConnectUI.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 360,
                messages: [{
                    address: address,
                    amount: amount.toString(),
                    payload: payload
                }],
            });

            console.log("Transaction sent successfully:", result);

            // Обновляем данные после успешной отправки
            await raffle.fetchCurrentRaffle();
            await raffle.fetchUserTickets();
        } catch (error) {
            console.error("Transaction error:", error);
            if (props.onTxComplete) props.onTxComplete("Transaction not sent");
        } finally {
            setIsLoading(false);
            if (props.onTxComplete && !props.onTxComplete.toString().includes("return")) {
                props.onTxComplete();
            }
        }
    };

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
                {isLoading ? "Loading..." : props.price}
                {!isLoading && <img src={tonImg} alt="Ton" className={styles.ticketCardTon} />}
            </Button>
        </div>
    );
};

export default SendTx;