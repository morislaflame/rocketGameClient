import { useContext, useState } from "react";
import { Context, IStoreContext } from "@/store/StoreProvider";
import { Button } from "@/components/ui/button";
import SendCaseTx from "@/utils/SendCaseTx";
import styles from "./CasesComponents.module.css";
import starImg from "@/assets/stars.svg";

interface CasePurchaseButtonsProps {
  caseId: number;
  price?: string | number; // TON price
  starsPrice?: number;
  disabled?: boolean;
  onPurchase?: (success: boolean) => void;
}

const CasePurchaseButtons: React.FC<CasePurchaseButtonsProps> = ({
  caseId,
  price,
  starsPrice,
  disabled = false,
  onPurchase
}) => {
  const { cases, user } = useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState(false);
  
  // Получаем доступ к Telegram WebApp
  const tg = window.Telegram?.WebApp;

  const handleStarsPurchase = async () => {
    try {
      setIsLoading(true);
      await cases.generateInvoice(caseId);
      // После успешной оплаты обновляем список кейсов
      cases.fetchUserCases();
    } catch (error) {
      console.error("Error generating invoice:", error);
      if (onPurchase) onPurchase(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTxStart = () => {
    setIsLoading(true);
  };

  const handleTxComplete = (error?: string) => {
    setIsLoading(false);
    if (onPurchase) onPurchase(!error);
  };

  return (
    <div className={styles.purchaseButtonsContainer}>
      {price && Number(price) > 0 && (
        <SendCaseTx
          price={price.toString()}
          caseId={caseId}
          onTxStart={handleTxStart}
          onTxComplete={handleTxComplete}
          disabled={disabled || isLoading || !user.isAuth}
        />
      )}
      
      {starsPrice && starsPrice > 0 && (
        <Button
          onClick={handleStarsPurchase}
          disabled={disabled || isLoading || !user.isAuth}
          variant="secondary"
          className={styles.starsButton}
        >
          {isLoading ? "Processing..." : starsPrice}
          {!isLoading && (
            <img src={starImg} alt="Stars" className={styles.starsIcon} />
          )}
        </Button>
      )}
    </div>
  );
};

export default CasePurchaseButtons;
