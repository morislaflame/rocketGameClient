import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle, 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPrize } from "@/types/types";
import styles from "./FunctionalComponents.module.css";

interface SellPrizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prize: UserPrize | null;
  onSell: () => Promise<void>;
  isLoading: boolean;
}

const SellPrizeDialog: React.FC<SellPrizeDialogProps> = ({
  open,
  onOpenChange,
  prize,
  onSell,
  isLoading
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dailyRewardModal}>
        <DialogHeader>
            <DialogTitle>Selling a gift</DialogTitle>
            <DialogDescription>
                You are about to sell the gift and receive tokens
            </DialogDescription>
        </DialogHeader>
        {prize && (
          <div className='flex flex-col items-center gap-1 w-full'>
            <p>You will receive: {prize.prize.value} tokens</p>
          </div>
        )}
        <DialogFooter className="flex flex-col gap-1">
          
          <Button 
            onClick={onSell} 
            disabled={isLoading}
          >
            Sell gift
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SellPrizeDialog;