import React, { useCallback, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { FaTrophy, FaMoneyBillWave, FaShippingFast } from "react-icons/fa";
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
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Context, IStoreContext } from "@/store/StoreProvider";
import styles from "./UserAccountComponents.module.css";
import { UserPrize } from "@/types/types";
import { Button } from "@/components/ui/button";
import ListSkeleton from "../ListSkeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const UserPrizesDrawer: React.FC = observer(() => {
  const { userPrize, user } = useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Состояние для диалога получения приза
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState("");
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
      const result = await userPrize.receiveUserPrize(selectedPrizeId, deliveryDetails);
      if (result) {
        setReceiveDialogOpen(false);
        setDeliveryDetails("");
      }
    } catch (error) {
      console.error("Error receiving prize:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild style={{ width: "100%" }}>
          <div onClick={handlePrizesOpen}>
            <UserAccCard
              title="Winning gifts"
              icon={<FaTrophy />}
              description="All the gifts you have won in the drawings"
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
            <div className={styles.prizesList}>
              {isLoading ? (
                <ListSkeleton count={3}/>
              ) : userPrize.userPrizes && userPrize.userPrizes.length > 0 ? (
                userPrize.userPrizes.map((prize: UserPrize) => (
                  <Card key={prize.id} className={styles.prizeCard}>
                    <CardHeader className={styles.prizeCardHeader}>
                      <div className={styles.prizeImageContainer}>
                        <img 
                          src={prize.raffle_prize.imageUrl || '/placeholder-prize.png'} 
                          alt={prize.raffle_prize.name}
                          className={styles.prizeImage}
                        />
                      </div>
                      <div className={styles.prizeInfo}>
                        <CardTitle className={styles.prizeCardTitle}>
                          {prize.raffle_prize.name}
                        </CardTitle>
                        <CardDescription>
                          Выигран: {prize.winDate}
                        </CardDescription>
                        <div className={styles.prizeValue}>
                          Стоимость: {prize.raffle_prize.value} токенов
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className={styles.prizeDescription}>
                        {prize.raffle_prize.description}
                      </p>
                      <div className={styles.prizeStatus}>
                        {prize.status === 'pending' && "In anticipation"}
                        {prize.status === 'sold' && "Sold for tokens"}
                        {prize.status === 'received' && "Received physically"}
                      </div>
                    </CardContent>
                    {prize.status === 'pending' && (
                      <CardFooter className={styles.prizeCardFooter}>
                        <Button 
                          variant="outline" 
                          className={styles.sellButton}
                          onClick={() => handleOpenSellDialog(prize)}
                        >
                          <FaMoneyBillWave className={styles.buttonIcon} />
                          Sell for tokens
                        </Button>
                        <Button 
                          className={styles.receiveButton}
                          onClick={() => handleOpenReceiveDialog(prize.id)}
                        >
                          <FaShippingFast className={styles.buttonIcon} />
                          Get prize
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))
              ) : (
                <div className={styles.emptyMessage}>
                  You don't have any winning gifts yet. Participate in the drawings to win!
                  <img 
                  src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Objects/Money%20Bag.webp" 
                  alt="Money Bag" 
                  width="25" 
                  height="25" 
                  className="inline-block mr-2"
                  />
                </div>
              )}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Диалог для запроса физического получения приза */}
      <Dialog open={receiveDialogOpen} onOpenChange={setReceiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Получение приза</DialogTitle>
            <DialogDescription>
              Укажите данные для доставки или связи с вами
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiveDialogOpen(false)}>
              Отмена
            </Button>
            <Button 
              onClick={handleReceivePrize} 
              disabled={!deliveryDetails.trim() || isLoading}
            >
              Отправить запрос
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог для продажи приза */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Продажа приза</DialogTitle>
            <DialogDescription>
              Вы собираетесь продать приз и получить токены
            </DialogDescription>
          </DialogHeader>
          {prizeToSell && (
            <div className={styles.sellConfirmation}>
              <p>Приз: <strong>{prizeToSell.raffle_prize.name}</strong></p>
              <p>Вы получите: <strong>{prizeToSell.raffle_prize.value} токенов</strong></p>
              <p className={styles.warningText}>Внимание! Это действие нельзя отменить.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSellDialogOpen(false)}>
              Отмена
            </Button>
            <Button 
              onClick={handleSellPrize} 
              disabled={isLoading}
            >
              Продать приз
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default UserPrizesDrawer;