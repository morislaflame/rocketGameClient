import { Button } from "@/components/ui/button";
import { useTonConnectUI } from "@tonconnect/ui-react";
import tonImg from "@/assets/TonIcon.svg";
import styles from "@/components/MainComponents/RaffleComponents/RaffleComponents.module.css";
import { useState, useContext } from "react";
// import { Alert, AlertTitle } from "@/components/ui/alert";
import { Context, IStoreContext } from "@/store/StoreProvider";
import { beginCell } from "ton-core";

interface SendTxProps {
    price: string;
    packageId: number;
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
        
        if (!isConnected) {
            await tonConnectUI.openModal();
            setIsLoading(false);
            return;
        } 
        
        if (!isConnectionRestored) {
            console.error("Подключение не восстановлено. Переподключите кошелек");
            setIsLoading(false);
            return;
        }
        
        try {
            // Создаем уникальный идентификатор (timestamp + случайное число)
            const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            
            // Создаем payload с маркером, ID пользователя, ID пакета и уникальным номером
            const payload = beginCell()
                .storeUint(0, 32)  // Маркер операции (0)
                .storeStringTail(`${user.user?.id || 0}:${props.packageId}:raffleTicket:${uniqueId}`)  // Формат "userId:packageId:тип:уникальныйИД"
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
            
            console.log("Transaction result:", result);
            console.log("Transaction boc:", result.boc);
            
            if (result && result.boc) {
                // Отправляем транзакцию на бэкенд для проверки
                const confirmResult = await raffle.confirmRaffleTicketPurchase(
                    user.user?.id || 0, 
                    props.packageId, 
                    result.boc
                );
                
                if (confirmResult) {
                    console.log(`Билеты успешно куплены!`);
                    // Обновляем данные
                    await raffle.fetchCurrentRaffle();
                }
            } else {
                console.error("Не удалось получить данные транзакции");
            }
        } catch (error) {
            console.error(error);
            console.error("Ошибка при отправке транзакции");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <Button 
                onClick={handleSendTx}
                disabled={isLoading}
                variant="secondary"
                style={{
                    minWidth: "90px",
                    border: "1px solid hsl(0deg 0.67% 27.27%)",
                }}
                >
                    {isLoading ? "Загрузка..." : props.price}
                    {!isLoading && <img src={tonImg} alt="Ton" className={styles.ticketCardTon} />}
            </Button>
        </div>
    )
}

export default SendTx;


