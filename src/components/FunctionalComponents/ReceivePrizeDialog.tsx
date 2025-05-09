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
import { useTranslate } from "@/utils/useTranslate";
import { observer } from "mobx-react-lite";

interface ReceivePrizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReceive: () => Promise<void>;
  isLoading: boolean;
}

const ReceivePrizeDialog: React.FC<ReceivePrizeDialogProps> = observer(({
  open,
  onOpenChange,
  onReceive,
  isLoading
}) => {
  const { t } = useTranslate();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dailyRewardModal}>
        <DialogHeader>
          <DialogTitle>{t('receiving_a_gift')}</DialogTitle>
          <DialogDescription>
            {t('once_confirmed_you_will_be_contacted_within_a_couple_hours_to_issue_the_gift')}
          </DialogDescription>
        </DialogHeader>
       
        <DialogFooter className="flex flex-col gap-2">
          
          <Button 
            
            onClick={onReceive} 
            disabled={isLoading}
          >
            {t('send_request')}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('close')}    
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default ReceivePrizeDialog;