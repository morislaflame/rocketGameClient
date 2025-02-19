// src/components/DailyRewardModal.tsx
import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "@/main";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // <-- вместо alert-dialog
import { Button } from "@/components/ui/button";
import styles from "./FunctionalComponents.module.css";
import { getTriesImg } from "@/utils/getPlanetImg";

const DailyRewardModal: React.FC = observer(() => {
  const { user, dailyReward } = useContext(Context);

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
      <img src={getTriesImg()} alt="Tries" />
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
                Claim Your Daily Reward
            </div>
            <div className={styles.descriptionPost}>
                Check out the app every day and pick up even more rewards!
            </div>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={handleClaim}>Claim</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default DailyRewardModal;
