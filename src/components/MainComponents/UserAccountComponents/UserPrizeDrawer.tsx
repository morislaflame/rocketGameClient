import React, { useCallback, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { FaTrophy } from "react-icons/fa";
import UserAccCard from "@/components/ui/UserAccCard";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Context, IStoreContext } from "@/store/StoreProvider";
import styles from "./UserAccountComponents.module.css";
import { UserPrize } from "@/types/types";
import { Button } from "@/components/ui/button";
import { getPlanetImg } from "@/utils/getPlanetImg";
import ReceivePrizeDialog from "@/components/FunctionalComponents/ReceivePrizeDialog";
import SellPrizeDialog from "@/components/FunctionalComponents/SellPrizeDialog";
import Lottie from "lottie-react";
import moneyBag from "@/assets/moneybag.json";

import { Skeleton } from "@/components/ui/skeleton";
const UserPrizesDrawer: React.FC = observer(() => {
  const { userPrize, user } = useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Состояние для диалога получения приза
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [selectedPrizeId, setSelectedPrizeId] = useState<number | null>(null);
  
  // Состояние для диалога продажи приза
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [prizeToSell, setPrizeToSell] = useState<UserPrize | null>(null);

  // При открытии Drawer загружаем призы
  const handlePrizesOpen = useCallback(async () => {
    try {
      setIsLoading(true);
      await userPrize.fetchUserPrizes();
    } catch (error) {
      console.error("Error during fetching user prizes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userPrize]);

  // Обработчик кнопки "Получить приз"
  const handleOpenReceiveDialog = (prizeId: number) => {
    setSelectedPrizeId(prizeId);
    setReceiveDialogOpen(true);
  };

  // Обработчик кнопки "Продать приз"
  const handleOpenSellDialog = (prize: UserPrize) => {
    setPrizeToSell(prize);
    setSellDialogOpen(true);
  };

  // Обработчик продажи приза
  const handleSellPrize = async () => {
    if (!prizeToSell) return;
    
    try {
      setIsLoading(true);
      const result = await userPrize.sellUserPrize(prizeToSell.id);
      if (result) {
        // Обновляем баланс пользователя
        await user.fetchMyInfo();
        setSellDialogOpen(false);
      }
    } catch (error) {
      console.error("Error selling prize:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик получения приза
  const handleReceivePrize = async () => {
    if (!selectedPrizeId) return;
    
    try {
      setIsLoading(true);
      const result = await userPrize.receiveUserPrize(selectedPrizeId);
      if (result) {
        setReceiveDialogOpen(false);
      }
    } catch (error) {
      console.error("Error receiving prize:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const tokenImg = getPlanetImg();

  const isEmpty = userPrize.userPrizes && userPrize.userPrizes.length === 0;

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild style={{ width: "100%" }}>
          <div onClick={handlePrizesOpen}>
            <UserAccCard
              title="Winning gifts"
              icon={<FaTrophy />}
              description="All the gifts you have won in the raffle"
            />
          </div>
        </DrawerTrigger>
        <DrawerContent className={styles.drawerContent}>
          <DrawerHeader className={styles.drawerHeader}>
            <DrawerTitle>Winning gifts</DrawerTitle>
            <DrawerDescription>
                You can get the winning gifts to your Telegram account or sell them for tokens
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="h-[70vh] w-[100%] rounded-md">
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
                <Skeleton  className="w-full h-[250px] rounded-md" />
               </div>
              ) : (
                userPrize.userPrizes.map((prize: UserPrize) => (
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
                          onClick={() => handleOpenSellDialog(prize)}
                        >
                          Sell for tokens
                        </Button>
                        <Button 
                          variant="secondary"
                          className={styles.receiveButton}
                          onClick={() => handleOpenReceiveDialog(prize.id)}
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
        </DrawerContent>
      </Drawer>

      {/* Диалог для запроса физического получения приза */}
      <ReceivePrizeDialog 
        open={receiveDialogOpen}
        onOpenChange={setReceiveDialogOpen}
        onReceive={handleReceivePrize}
        isLoading={isLoading}
      />

      {/* Диалог для продажи приза */}
      <SellPrizeDialog 
        open={sellDialogOpen}
        onOpenChange={setSellDialogOpen}
        prize={prizeToSell}
        onSell={handleSellPrize}
        isLoading={isLoading}
      />
    </>
  );
});

export default UserPrizesDrawer;