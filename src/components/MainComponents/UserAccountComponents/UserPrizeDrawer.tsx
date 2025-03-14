import React, { useCallback, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context, IStoreContext } from "@/store/StoreProvider";
import { UserPrize } from "@/types/types";
import UserPrizesList from "./UserPrizesList";
import ReceivePrizeDialog from "@/components/FunctionalComponents/ReceivePrizeDialog";
import SellPrizeDialog from "@/components/FunctionalComponents/SellPrizeDialog";

const UserPrizesDrawer: React.FC = observer(() => {
  const { userPrize, user } = useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Состояние для диалога получения приза
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [selectedPrizeId, setSelectedPrizeId] = useState<number | null>(null);
  
  // Состояние для диалога продажи приза
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [prizeToSell, setPrizeToSell] = useState<UserPrize | null>(null);

  // При открытии диалога загружаем призы
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

  return (
    <>
      <UserPrizesList
        isLoading={isLoading}
        userPrizes={userPrize.userPrizes}
        onOpenSellDialog={handleOpenSellDialog}
        onOpenReceiveDialog={handleOpenReceiveDialog}
        onOpen={handlePrizesOpen}
      />

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