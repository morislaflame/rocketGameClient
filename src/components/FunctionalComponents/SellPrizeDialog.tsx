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
import { useTranslate } from "@/utils/useTranslate";
import { observer } from "mobx-react-lite";

interface SellPrizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prize: UserPrize | null;
  onSell: () => Promise<void>;
  isLoading: boolean;
}

const SellPrizeDialog: React.FC<SellPrizeDialogProps> = observer(({
  open,
  onOpenChange,
  prize,
  onSell,
  isLoading
}) => {
  const { t } = useTranslate();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dailyRewardModal}>
        <DialogHeader>
            <DialogTitle>{t('selling_a_gift')}</DialogTitle>
            <DialogDescription>
                {t('you_are_about_to_sell_the_gift_and_receive_tokens')}
            </DialogDescription>
        </DialogHeader>
        {prize && (
          <div className='flex flex-col items-center gap-1 w-full'>
            <p>{t('you_will_receive')}: {prize.prize.value} {t('tokens')}</p>
          </div>
        )}
        <DialogFooter className="flex flex-col gap-1">
          
          <Button 
            onClick={onSell} 
            disabled={isLoading}
          >
            {t('sell_gift')}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default SellPrizeDialog;