import React, { useLayoutEffect, useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogDescription,
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
    const [localError, setLocalError] = useState<string | null>(null);

    useLayoutEffect(() => {
        if (showAlert) {
            setLocalError(error || null);
        }
    }, [error, showAlert]);

    const hasError = loading ? false : !!(error || localError);

    // Автоматическое закрытие через 2 секунды при успехе
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (showAlert && !loading && !hasError) {
            timeout = setTimeout(() => {
                onClose();
            }, 2000); // 2 секунды
        }
        return () => clearTimeout(timeout);
    }, [showAlert, loading, hasError, onClose]);

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    return (
        <Dialog open={showAlert} onOpenChange={(open) => !loading && !open && onClose()} >
            <DialogContent onPointerDownOutside={(event) => event.preventDefault()} className={styles.dailyRewardModal} style={{ zIndex: 900 }}> 
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground text-center">
                        {loading 
                            ? "Please wait. Your transaction is being processed..." 
                            : hasError    
                                ? localError || "An error occurred while executing the transaction."
                                : "Your tickets have been successfully added!"}
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