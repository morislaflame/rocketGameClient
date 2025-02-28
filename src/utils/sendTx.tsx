import { Button } from "@/components/ui/button";
import { useTonConnectUI } from "@tonconnect/ui-react";
import tonImg from "@/assets/TonIcon.svg";
import styles from "@/components/MainComponents/RaffleComponents/RaffleComponents.module.css";
import { useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";

interface SendTxProps {
    price: string;
}

 const SendTx: React.FC<SendTxProps> = (props) => {
    const [tonConnectUI] = useTonConnectUI();

    const isConnectionRestored = tonConnectUI.connectionRestored;
    const isConnected = tonConnectUI.connected;
    console.log(isConnectionRestored);
    console.log(isConnected);

    const address = import.meta.env.VITE_TON_ADDRESS;
    const amount = Number(props.price) * 1000000000;

    const [isLoading, setIsLoading] = useState(false);

    const handleSendTx = async () => {
        setIsLoading(true);
        if (!isConnected) {
            await tonConnectUI.openModal();
        } else if (!isConnectionRestored) {
            return <Alert variant="destructive">
                        <AlertTitle>Connection not restored</AlertTitle>
                    </Alert>
        } else {
            try {
                const result = await tonConnectUI.sendTransaction({
                    validUntil: Math.floor(Date.now() / 1000) + 360,
                    messages: [{
                    address: address,
                    amount: amount.toString(),
                }],
            });
            console.log(result.boc);
            } catch (error) {
                console.error(error);
            }
        }
        setIsLoading(false);
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
                    {props.price}
                    <img src={tonImg} alt="Ton" className={styles.ticketCardTon} />
            </Button>
        </div>
    )
}

export default SendTx;


