import { useContext, useState, ChangeEvent } from "react";
import { Context, IStoreContext } from "@/store/StoreProvider";
import { Button } from "@/components/ui/button";
import SendCaseTx from "@/utils/SendCaseTx";
import styles from "./CasesComponents.module.css";
import starImg from "@/assets/stars.svg";
import { Minus, Plus } from "lucide-react";
import { getPlanetImg } from "@/utils/getPlanetImg";
import { observer } from "mobx-react-lite";

interface CasePurchaseButtonsProps {
  caseId: number;
  price?: string | number; // TON price
  starsPrice?: number;
  pointsPrice?: number;
  disabled?: boolean;
  onPurchase?: (success: boolean) => void;
}

const CasePurchaseButtons: React.FC<CasePurchaseButtonsProps> = observer(({
  caseId,
  price,
  starsPrice,
  pointsPrice,
  disabled = false,
  onPurchase
}) => {
  const { cases, user } = useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 20) {
      setQuantity(value);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    handleQuantityChange(value);
  };

  const handleStarsPurchase = async () => {
    try {
      setIsLoading(true);
      await cases.generateInvoice(caseId, quantity);
      // После успешной оплаты обновляем список кейсов
      // cases.fetchUserCases();
    } catch (error) {
      console.error("Error generating invoice:", error);
      if (onPurchase) onPurchase(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePointsPurchase = async () => {
    try {
      setIsLoading(true);
      const result = await cases.purchaseCaseWithPoints(caseId, quantity);
      if (result && onPurchase) {
        onPurchase(true);
      }
    } catch (error) {
      console.error("Error purchasing with points:", error);
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

  const planetImg = getPlanetImg();

  // Вычисляем достаточно ли поинтов для покупки
  const hasEnoughPoints = pointsPrice ? 
    user.user?.balance !== undefined && user.user.balance >= (pointsPrice * quantity) :
    false;

  return (
    <div className={styles.purchaseButtonsContainer}>
      <div className={styles.quantitySelector}>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1 || isLoading}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <input
          className={styles.quantityInput}
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={1}
          max={20}
          disabled={isLoading}
        />
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= 20 || isLoading}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className={styles.buttonsRow}>
        {price && Number(price) > 0 && (
          <SendCaseTx
            price={price.toString()}
            caseId={caseId}
            quantity={quantity}
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
            {isLoading ? "Processing..." : starsPrice * quantity}
            {!isLoading && (
              <img src={starImg} alt="Stars" className={styles.starsIcon} />
            )}
          </Button>
        )}
        
        {pointsPrice && pointsPrice > 0 && (
          <Button
            onClick={handlePointsPurchase}
            disabled={disabled || isLoading || !user.isAuth || !hasEnoughPoints}
            variant="secondary"
            className={styles.pointsButton}
          >
            {isLoading ? "Processing..." : pointsPrice * quantity}
            {!isLoading && (
              <img src={planetImg} alt="Planet" className={styles.balanceImg} />
            )}
          </Button>
        )}
      </div>
    </div>
  );
});

export default CasePurchaseButtons;
