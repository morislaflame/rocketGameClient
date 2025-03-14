import React from "react";
import { observer } from "mobx-react-lite";
import { FaTrophy } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "./UserAccountComponents.module.css";
import { UserPrize } from "@/types/types";
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
        <div className="flex flex-col space-y-1.5 p-[12px] " onClick={onOpen}>
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
          <div className="flex justify-center items-center text-center relative"
          style={{
            padding: "calc(var(--spacing)* 4) calc(var(--spacing)* 4) calc(var(--spacing)* 2)",
          }}>
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
                <p style={{width: "80%"}}>You don't have any winning gifts yet. Participate in the drawings to win!</p>
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
                      <img 
                        src={prize.raffle.raffle_prize.imageUrl || tokenImg} 
                        alt={prize.raffle.raffle_prize.name}
                        className={styles.prizeImage}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {prize.raffle.raffle_prize.name}
                    </div>
                    <div className="flex items-center gap-2 text-m text-white">
                      {prize.raffle.raffle_prize.value} <img src={tokenImg} alt="Planet" width="18" height="18" />
                    </div>
                    <div>
                      <div className={styles.prizeStatus}>
                        {prize.status === 'pending' && ""}
                        {prize.status === 'sold' && "Sold for tokens"}
                        {prize.status === 'received' && "Received physically"}
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