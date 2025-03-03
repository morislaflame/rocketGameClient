import React, { useLayoutEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
//   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import styles from './FunctionalComponents.module.css';

interface TransactionAlertProps {
  showAlert: boolean;
  onClose: () => void;
  loading: boolean;
  error?: string | null;
}

const TransactionAlert: React.FC<TransactionAlertProps> = ({ showAlert, onClose, loading, error }) => {
  // Локальная копия состояния для предотвращения "мигания" при закрытии
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Используем useLayoutEffect вместо useEffect для более быстрой синхронизации
  useLayoutEffect(() => {
    if (showAlert) {
      setLocalError(error || null);
    }
  }, [error, showAlert]);
  
  // Определяем состояние ошибки, учитывая как текущую ошибку, так и локальную копию
  const hasError = loading ? false : !!(error || localError);

  // Обработчик для закрытия диалога
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={showAlert} onOpenChange={(open) => !loading && !open && onClose()}>
      <DialogContent className={styles.dailyRewardModal}>
        <DialogHeader className={styles.dailyRewardModalHeader}>
          {loading ? (
            <AiOutlineLoading3Quarters size={48} className={styles.spinningIcon} />
          ) : hasError ? (
            <IoMdClose size={48} color="red" />
          ) : (
            <IoIosCheckmarkCircle size={48} color="green" />
          )}
        </DialogHeader>
        <DialogDescription className='flex flex-col items-center gap-2 w-full'>
          <div className='text-2xl font-semibold leading-none tracking-tight relative text-white'>
            {loading ? "Transaction in process" : 
             hasError ? "Transaction error" : 
             "Transaction completed"}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {loading 
              ? "Please wait. Your transaction is being processed..." 
              : hasError    
                ? localError || "An error occurred while executing the transaction."
                : "Stay tuned for updates on the current raffle!"}
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            variant="secondary"
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionAlert;