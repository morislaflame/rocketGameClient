// src/components/DailyRewardModal.tsx
import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context, IStoreContext } from "@/store/StoreProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"; // <-- вместо alert-dialog
import { Button } from "@/components/ui/button";
import styles from "./FunctionalComponents.module.css";
import { getTriesImg } from "@/utils/getPlanetImg";
import { useTranslate } from "@/utils/useTranslate";

const DailyRewardModal: React.FC = observer(() => {
  const { user, dailyReward } = useContext(Context) as IStoreContext;
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (dailyReward.available) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [dailyReward.available]);

  const handleClaim = async () => {
    try {
      const data = await dailyReward.claimDailyReward();
      // Обновляем данные пользователя (баланс, попытки)
      await user.fetchMyInfo();
      console.log("Reward claimed response:", data);
      setOpen(false);
    } catch (error) {
      console.error("Error claiming daily reward:", error);
    }
  };

  // Если награда недоступна, вообще не рендерим диалог
  if (!dailyReward.available) return null;

  const rewardImg =
    dailyReward.rewardInfo?.rewardType === "attempts" ? (
      <img src={getTriesImg()} alt="Tries" width={24} height={24}/>
    ) : null;

  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={styles.dailyRewardModal}>
        <DialogHeader className={styles.dailyRewardModalHeader}>
            +{dailyReward.rewardInfo?.reward} {rewardImg}
        </DialogHeader>
        <DialogDescription className={styles.dailyRewardModalDescription}>
            {/* <div className={styles.dayDescription}>
                {dailyReward.rewardInfo?.description}
            </div> */}
            <div className={styles.description}>
                {t('claim_your_daily_reward')}
            </div>
            <div className={styles.descriptionPost}>
                {t('check_out_the_app_every_day_and_pick_up_even_more_rewards')}
            </div>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={handleClaim}>{t('claim')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default DailyRewardModal;
