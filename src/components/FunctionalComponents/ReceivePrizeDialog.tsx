import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import styles from "./FunctionalComponents.module.css";

interface ReceivePrizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReceive: () => Promise<void>;
  isLoading: boolean;
}

const ReceivePrizeDialog: React.FC<ReceivePrizeDialogProps> = ({
  open,
  onOpenChange,
  onReceive,
  isLoading
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dailyRewardModal}>
        <DialogHeader>
          <DialogTitle>Receiving a gift</DialogTitle>
          <DialogDescription>
            Once confirmed, you will be contacted within a couple hours to issue the gift
          </DialogDescription>
        </DialogHeader>
       
        <DialogFooter className="flex flex-col gap-2">
          
          <Button 
            
            onClick={onReceive} 
            disabled={isLoading}
          >
            Send request
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel    
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceivePrizeDialog;