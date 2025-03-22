import React, { useEffect, useState } from "react";
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

  // Состояние для хранения JSON-анимаций по URL
  const [animations, setAnimations] = useState<{ [url: string]: Record<string, unknown> }>({});

  // Загружаем анимации для призов с JSON-медиа
  useEffect(() => {
    const loadAnimations = async () => {
      const newAnimations: { [url: string]: Record<string, unknown> } = {};
      for (const prize of userPrizes) {
        const mediaFile = prize.raffle.raffle_prize.media_file;
        if (mediaFile && mediaFile.mimeType === 'application/json' && !animations[mediaFile.url]) {
          try {
            const response = await fetch(mediaFile.url);
            const data = await response.json();
            newAnimations[mediaFile.url] = data;
          } catch (error) {
            console.error(`Ошибка загрузки анимации ${mediaFile.url}:`, error);
          }
        }
      }
      setAnimations(prev => ({ ...prev, ...newAnimations }));
    };
    if (userPrizes && userPrizes.length > 0) {
      loadAnimations();
    }
  }, [userPrizes, animations]);

  // Функция для отображения медиа приза (анимация или изображение)
  const renderPrizeMedia = (rafflePrize: RafflePrize) => {
    const mediaFile = rafflePrize.media_file;
    if (mediaFile) {
      const { url, mimeType } = mediaFile;
      if (mimeType === 'application/json' && animations[url]) {
        return (
          <Lottie
            animationData={animations[url]}
            loop={true}
            autoplay={true}
            // При необходимости можно указать размеры, например:
            // style={{ width: 64, height: 64 }}
          />
        );
      } else if (mimeType.startsWith('image/')) {
        return <img src={url} alt={rafflePrize.name} className={styles.prizeImage} />;
      }
    } else if (rafflePrize.imageUrl) {
      return <img src={rafflePrize.imageUrl} alt={rafflePrize.name} className={styles.prizeImage} />;
    }
    return <img src={tokenImg} alt="No prize" className={styles.prizeImage} />;
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
              Winning gifts
            </MorphingDialogTitle>
          </div>
          <div className="flex flex-col items-start justify-center space-y-0">
            <MorphingDialogSubtitle className="text-sm text-muted-foreground">
              All the gifts you have won in the raffle
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
                Winning gifts
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="text-sm text-gray-500 w-[70%]">
                All the gifts you have won in the raffle
              </MorphingDialogSubtitle>
            </div>
          </div>
          <ScrollArea className="h-[60vh] w-full rounded-md p-3">
            {isEmpty && (
              <div className={styles.emptyMessage}>
                <p style={{ width: "80%" }}>
                  You don't have any winning gifts yet. Participate in the drawings to win!
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
                      {renderPrizeMedia(prize.raffle.raffle_prize)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {prize.raffle.raffle_prize.name}
                    </div>
                    <div className="flex items-center gap-2 text-m text-white">
                      {prize.raffle.raffle_prize.value}{" "}
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
                          className={styles.sellButton}
                          onClick={() => onOpenSellDialog(prize)}
                        >
                          Sell for tokens
                        </Button>
                        <Button
                          variant="secondary"
                          className={styles.receiveButton}
                          onClick={() => onOpenReceiveDialog(prize.id)}
                        >
                          Get gift
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
