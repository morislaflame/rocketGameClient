import { useContext, useState, ChangeEvent } from "react";
import { Context, IStoreContext } from "@/store/StoreProvider";
import { Button } from "@/components/ui/button";
import SendCaseTx from "@/utils/SendCaseTx";
import styles from "./CasesComponents.module.css";
import starImg from "@/assets/stars.svg";
import { Minus, Plus } from "lucide-react";
import { getPlanetImg } from "@/utils/getPlanetImg";
import { observer } from "mobx-react-lite";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

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
  const [isPointsLoading, setIsPointsLoading] = useState(false);
  const [isStarsLoading, setIsStarsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [alertVisible, setAlertVisible] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

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
      setIsStarsLoading(true);
      await cases.generateInvoice(caseId, quantity);
    } catch (error) {
      console.error("Error generating invoice:", error);
      if (onPurchase) onPurchase(false);
    } finally {
      setIsStarsLoading(false);
    }
  };

  const handlePointsPurchase = async () => {
    try {
      setIsPointsLoading(true);
      const result = await cases.purchaseCaseWithPoints(caseId, quantity);
      if (result && onPurchase) {
        onPurchase(true);
      }
    } catch (error) {
      console.error("Error purchasing with points:", error);
      if (onPurchase) onPurchase(false);
    } finally {
      setIsPointsLoading(false);
    }
  };

  const handleTxStart = () => {
    setIsLoading(true);
    setTxLoading(true);
    setTxError(null);
    setAlertVisible(true);
  };

  const handleTxComplete = (error?: string) => {
    setIsLoading(false);
    setTxLoading(false);
    if (error) {
      setTxError(error);
    }
  };

  const closeAlert = () => {
    if (!txLoading) {
      setAlertVisible(false);
      setTxError(null);
    }
  };

  const planetImg = getPlanetImg();

  // Вычисляем достаточно ли поинтов для покупки
  const hasEnoughPoints = pointsPrice ? 
    user.user?.balance !== undefined && user.user.balance >= (pointsPrice * quantity) :
    false;

  return (
    <div className={styles.purchaseButtonsContainer}>
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
              <p>Transaction not completed</p>
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
      
      {!alertVisible && ( 
      <>
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
            disabled={disabled || isLoading || !user.isAuth || isStarsLoading || isPointsLoading}
          />
        )}
        
        {starsPrice && starsPrice > 0 && (
          <Button
            onClick={handleStarsPurchase}
            disabled={disabled || isStarsLoading || !user.isAuth || isLoading || isPointsLoading}
            variant="secondary"
            className={styles.starsButton}
          >
            {isStarsLoading ? "Processing..." : starsPrice * quantity}
            {!isStarsLoading && (
              <img src={starImg} alt="Stars" className={styles.starsIcon} />
            )}
          </Button>
        )}
        
        {pointsPrice && pointsPrice > 0 && (
          <Button
            onClick={handlePointsPurchase}
            disabled={disabled || isPointsLoading || !user.isAuth || !hasEnoughPoints || isLoading || isStarsLoading}
            variant="secondary"
            className={styles.pointsButton}
          >
            {isPointsLoading ? "Processing..." : pointsPrice * quantity}
            {!isPointsLoading && (
              <img src={planetImg} alt="Planet" className={styles.balanceImg} />
            )}
          </Button>
        )}
      </div>
      </>
      )}
    </div>
  );
});

export default CasePurchaseButtons;
