import React, { useState, useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context, IStoreContext } from "@/store/StoreProvider";
import Lottie from "lottie-react";
import styles from "./FunctionalComponents.module.css";
import { Button } from "../ui/button";
import { getPlanetImg } from "@/utils/getPlanetImg";
import { getUserName } from "@/utils/getUserName";
import { RafflePrize, UserInfo } from "@/types/types";
import ListSkeleton from "../MainComponents/ListSkeleton";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
} from "@/components/ui/morphing-dailog";
import { ScrollArea } from "@/components/ui/scroll-area";
import trophy from "@/assets/trophy.json";

const RaffleHistoryMorphingDialog: React.FC = observer(() => {
  const { raffle } = useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [animations, setAnimations] = useState<{ [url: string]: Record<string, unknown> }>({});
  const pageSize = 10;

  const loadHistory = async (currentOffset: number, append: boolean = false) => {
    setIsLoading(true);
    try {
      const data = await raffle.fetchRaffleHistory(pageSize, currentOffset, append);
      setOffset(currentOffset + data.length);
      if (data.length < pageSize) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Ошибка при загрузке истории розыгрышей:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenHistory = async () => {
    setOffset(0);
    setHasMore(true);
    await loadHistory(0, false);
  };

  const handleLoadMore = async () => {
    await loadHistory(offset, true);
  };

  useEffect(() => {
    const loadAnimations = async () => {
      const newAnimations: { [url: string]: Record<string, unknown> } = {};
      for (const item of raffle.raffleHistory || []) {
        const mediaFile = item.raffle_prize?.media_file;
        if (mediaFile && mediaFile.mimeType === 'application/json' && !animations[mediaFile.url]) {
          try {
            const response = await fetch(mediaFile.url);
            const data = await response.json();
            newAnimations[mediaFile.url] = data;
          } catch (error) {
            console.error(`Error loading animation for ${mediaFile.url}:`, error);
          }
        }
      }
      setAnimations(prev => ({ ...prev, ...newAnimations }));
    };
    loadAnimations();
  }, [raffle.raffleHistory]);

  const tokenImg = getPlanetImg();

  const renderPrizeMedia = (prize: RafflePrize) => {
    const mediaFile = prize.media_file;
    if (mediaFile) {
      const { url, mimeType } = mediaFile;
      if (mimeType === 'application/json' && animations[url]) {
        return (
          <Lottie
            animationData={animations[url]}
            loop={false}
            autoplay={true}
            // style={{ width: 40, height: 40 }}
          />
        );
      } else if (mimeType.startsWith('image/')) {
        return <img src={url} alt={prize.name} className={styles.prizeImage} />;
      }
    } else if (prize.imageUrl) {
      return <img src={prize.imageUrl} alt={prize.name} className={styles.prizeImage} />;
    }
    return <img src={tokenImg} alt="No prize" className={styles.prizeImage} />;
  };

  return (
    <MorphingDialog transition={{ type: "spring", stiffness: 200, damping: 24 }}>
      <MorphingDialogTrigger
        style={{
          borderRadius: "calc(var(--radius) - 2px)",
          border: "1px solid hsl(0 0% 14.9%)",
          alignSelf: "center",
        }}
        className="border border-gray-200/60 bg-black rounded-md w-fit"
      >
        <div className="flex items-center space-x-3 p-3" onClick={handleOpenHistory}>
          <div className="flex items-center justify-center w-[36px] h-[36px]"> 
            <Lottie animationData={trophy} loop={false} width={36} height={36}/>
          </div>
          <div className="flex flex-col items-start justify-center space-y-0">
            <MorphingDialogTitle className="text-[16px] font-medium">
              Raffle History
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className="text-[10px] text-muted-foreground">
              See all past raffles and winners
            </MorphingDialogSubtitle>
          </div>
        </div>
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{ borderRadius: "12px", border: "1px solid hsl(0 0% 14.9%)" }}
          className="relative h-auto w-[90%] border bg-black"
        >
          <div className="flex justify-center items-center p-4 text-center relative">
            <div className="absolute top-4 left-3">
              <div className="flex items-center justify-center w-[48px] h-[48px]"> 
                <Lottie animationData={trophy} loop={false} width={48} height={48}/>
              </div>
            </div>
            <div className="px-6">
              <MorphingDialogTitle className="text-lg font-bold">
                Raffle History
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="text-sm text-gray-500">
                See all past raffles and winners
              </MorphingDialogSubtitle>
            </div>
          </div>

          <ScrollArea className="h-[60vh] w-full rounded-md p-3">
            {isLoading && offset === 0 ? (
              <ListSkeleton count={3} />
            ) : raffle.raffleHistory && raffle.raffleHistory.length > 0 ? (
              <div className={styles.raffleHistoryList}>
                {raffle.raffleHistory.map((item) => (
                  <div key={item.id} className={styles.raffleHistoryItem}>
                    <div className={styles.raffleHistoryItemHeader}>
                      <div className={styles.prizeImageContainer}>
                        {item.raffle_prize && renderPrizeMedia(item.raffle_prize)}
                      </div>
                      <h3 className={styles.raffleHistoryItemTitle}>
                        {item.raffle_prize ? item.raffle_prize.name : item.prize}
                      </h3>
                    </div>
                    <div className={styles.raffleHistoryItemDetails}>
                      <h4 className="text-xl font-semibold leading-none tracking-tight pb-1">
                        Raffle #{item.id}
                      </h4>
                      <p className="text-sm leading-none tracking-tight pb-2">
                        Winner: {getUserName(item.winner as unknown as UserInfo)}
                      </p>
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">
                          Winning ticket: #{item.winningTicketNumber || "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total tickets: {item.totalTickets || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Winner chance: {item.winnerChance || 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyHistory}>
                <p>Raffle history is empty</p>
              </div>
            )}
            {hasMore && (
              <div className="flex justify-center items-center mt-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Load more"}
                </Button>
              </div>
            )}
          </ScrollArea>

          <MorphingDialogClose className="text-zinc-500 rounded-md" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
});

export default RaffleHistoryMorphingDialog;