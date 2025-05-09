import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { FaTrophy } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "./UserAccountComponents.module.css";
import { UserPrize, RafflePrize } from "@/types/types";
import { Button } from "@/components/ui/button";
import { getPlanetImg } from "@/utils/getPlanetImg";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
} from "@/components/ui/morphing-dailog";
import Lottie from "lottie-react";
import moneyBag from "@/assets/moneybag.json";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaRenderer } from "@/utils/media-renderer";
import { useAnimationLoader } from '@/utils/useAnimationLoader';
import { useTranslate } from "@/utils/useTranslate";
import { IStoreContext } from "@/store/StoreProvider";
import { Context } from "@/store/StoreProvider";

interface UserPrizesListProps {
  isLoading: boolean;
  userPrizes: UserPrize[];
  onOpenSellDialog: (prize: UserPrize) => void;
  onOpenReceiveDialog: (prizeId: number) => void;
  onOpen: () => Promise<void>;
}

const UserPrizesList: React.FC<UserPrizesListProps> = observer(({
  isLoading,
  userPrizes,
  onOpenSellDialog,
  onOpenReceiveDialog,
  onOpen
}) => {
  const tokenImg = getPlanetImg();
  const isEmpty = userPrizes && userPrizes.length === 0;
  const { t } = useTranslate();

  // На это (с деструктуризацией массива):
  const [animationsObj] = useAnimationLoader(
    userPrizes,
    (item) => item.prize?.media_file,
    []
  );

  // Функция для отображения медиа приза
  const renderPrizeMedia = (rafflePrize: RafflePrize | null) => {
    if (!rafflePrize) {
      return <img src={tokenImg} alt="No prize" className={styles.prizeImage} />;
    }

    return (
      <MediaRenderer
        mediaFile={rafflePrize.media_file}
        imageUrl={rafflePrize.imageUrl}
        animations={animationsObj}
        name={rafflePrize.name}
        className={styles.prizeImage}
        loop={false}
      />
    );
  };

  // Функция для получения названия приза
  const getPrizeName = (prize: UserPrize) => {
    return prize.prize?.name || "Unknown Prize";
  };

  // Функция для получения стоимости приза
  const getPrizeValue = (prize: UserPrize) => {
    return prize.prize?.value || 0;
  };

  return (
    <MorphingDialog
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 24,
      }}
    >
      <MorphingDialogTrigger
        style={{
          borderRadius: "12px",
          border: "1px solid hsl(0 0% 14.9%)",
          alignSelf: "center",
          width: "100%",
          backgroundColor: "hsl(0 1% 10%)",
        }}
        className="border border-gray-200/60 bg-black rounded-xl w-fit"
      >
        <div className="flex flex-col space-y-1.5 p-[12px]" onClick={onOpen}>
          <div className="flex items-center gap-2">
            <FaTrophy size={16} />
            <MorphingDialogTitle className="text-[16px] font-semibold">
              {t('winning_gifts')}
            </MorphingDialogTitle>
          </div>
          <div className="flex flex-col items-start justify-center space-y-0">
            <MorphingDialogSubtitle className="text-sm text-muted-foreground">
              {t('all_gifts')}
            </MorphingDialogSubtitle>
          </div>
        </div>
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{ borderRadius: "12px", border: "1px solid hsl(0 0% 14.9%)" }}
          className="relative h-auto w-[90%] border bg-black"
        >
          <div
            className="flex justify-center items-center text-center relative"
            style={{
              padding: "calc(var(--spacing)* 4) calc(var(--spacing)* 4) calc(var(--spacing)* 2)",
            }}
          >
            <div className="absolute top-3 left-3">
              <div className="flex items-center justify-center w-[48px] h-[48px]">
                <FaTrophy size={24} />
              </div>
            </div>
            <div className="px-6 flex flex-col items-center justify-center gap-1">
              <MorphingDialogTitle className="text-lg font-bold">
                {t('winning_gifts')}
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="text-sm text-gray-500 w-[70%]">
                {t('all_gifts')}
              </MorphingDialogSubtitle>
            </div>
          </div>
          <ScrollArea className="h-[60vh] w-full rounded-md p-3">
            {isEmpty && (
              <div className={styles.emptyMessage}>
                <p style={{ width: "80%" }}>
                  {t('you_dont_have_any_winning_gifts')}
                </p>
                <div className="flex items-center justify-center w-[100px] h-[100px]">
                  <Lottie animationData={moneyBag} loop={true} />
                </div>
              </div>
            )}
            <div className={styles.prizesList}>
              {isLoading ? (
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton className="w-full h-[250px] rounded-md" />
                </div>
              ) : (
                userPrizes.map((prize: UserPrize) => (
                  <div key={prize.id} className={styles.prizeCard}>
                    <div className={styles.prizeImageContainer}>
                      {renderPrizeMedia(prize.prize)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground text-center">
                      {getPrizeName(prize)}
                    </div>
                    <div className="flex items-center gap-2 text-m text-white">
                      {getPrizeValue(prize)}{" "}
                      <img src={tokenImg} alt="Planet" width="18" height="18" />
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <div className={styles.prizeStatus}>
                        {prize.status === 'pending' && ""}
                        {prize.status === 'sold' && "Sold"}
                        {prize.status === 'received' && "Received"}
                        {prize.status === 'requested' && "Requested"}
                      </div>
                    </div>
                    {prize.status === 'pending' && (
                      <div className={styles.prizeCardFooter}>
                        <Button
                          variant="secondary"
                          className={styles.receiveButton}
                          onClick={() => onOpenSellDialog(prize)}
                        >
                          {t('sell_for_tokens')}
                        </Button>
                        <Button
                          variant="secondary"
                          className={styles.receiveButton}
                          onClick={() => onOpenReceiveDialog(prize.id)}
                        >
                          {t('get_gift')}
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <MorphingDialogClose className="text-zinc-500 rounded-md" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
});

export default UserPrizesList;
