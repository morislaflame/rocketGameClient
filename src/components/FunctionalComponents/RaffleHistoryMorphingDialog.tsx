import React, { useContext, useState } from "react"
import { observer } from "mobx-react-lite"
import { Context, IStoreContext } from "@/store/StoreProvider"

import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogImage,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
} from "@/components/ui/morphing-dailog"

import { ScrollArea } from "@/components/ui/scroll-area"
import ListSkeleton from "../MainComponents/ListSkeleton"
import { getPlanetImg } from "@/utils/getPlanetImg"
import { getUserName } from "@/utils/getUserName"
import { UserInfo } from "@/types/types"
import styles from "./FunctionalComponents.module.css"

const RaffleHistoryMorphingDialog: React.FC = observer(() => {
  const { raffle } = useContext(Context) as IStoreContext

  const [isLoading, setIsLoading] = useState(false)

  // Функция, вызывающаяся при клике внутри триггера, но до открытия диалога
  const handleOpenHistory = async () => {
    setIsLoading(true)
    // Если загрузка > 1с, показываем скелетон
    

    try {
      await raffle.fetchRaffleHistory()
    } catch (error) {
      console.error("Ошибка при загрузке истории розыгрышей:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const tokenImg = getPlanetImg()

  return (
    <MorphingDialog
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 24,
      }}
    >
      {/*
        === TRIGGER ===
        Кнопка/обёртка, при клике на которую:
         1) handleOpenHistory() загружает данные
         2) Событие всплывает -> MorphingDialogTrigger открывает диалог
      */}
      <MorphingDialogTrigger
        style={{ borderRadius: "calc(var(--radius) - 2px)", border: "1px solid hsl(0 0% 14.9%)" }}
        className="border border-gray-200/60 bg-black rounded-md w-fit"
      >
        <div
          className="flex items-center space-x-3 p-3"
          onClick={handleOpenHistory}
        >
          <MorphingDialogImage
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Activity/Trophy.webp"
            alt="Trophy"
            className="h-8 w-8 object-cover object-top"
            style={{ borderRadius: "4px" }}
          />
          <div className="flex flex-col items-start justify-center space-y-0">
            <MorphingDialogTitle className="text-[16px] font-medium">
              Raffle History
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className="text-[10px] text-gray-600 text-m">
                See all past raffles and winners
            </MorphingDialogSubtitle>
          </div>
        </div>
      </MorphingDialogTrigger>

      {/*
        === CONTAINER + CONTENT ===
        Портал + бэкдроп, затем внутренняя часть диалога
      */}
      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{ borderRadius: "12px", border: "1px solid hsl(0 0% 14.9%)" }}
          className="relative h-auto w-[90%] border  bg-black"
        >
        <div className="flex justify-center items-center p-4 text-center relative">
            <div className="absolute top-2 left-2">
                <MorphingDialogImage
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Activity/Trophy.webp" 
                alt="Trophy"
                className="h-16 w-16 object-cover object-center rounded"
                />
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
            {/* Логика отображения данных/скелетона */}
            {isLoading ? (
              <ListSkeleton count={3} />
            ) : raffle.raffleHistory && raffle.raffleHistory.length > 0 ? (
              <div className={styles.raffleHistoryList}>
                {raffle.raffleHistory.map((item) => (
                  <div key={item.id} className={styles.raffleHistoryItem}>
                    <div className={styles.raffleHistoryItemHeader}>
                      <div className={styles.prizeImageContainer}>
                        <img
                          src={item.raffle_prize?.imageUrl || tokenImg}
                          alt={item.raffle_prize?.name || ""}
                          className={styles.prizeImage}
                        />
                      </div>
                      <h3 className={styles.raffleHistoryItemTitle}>
                        {item.raffle_prize ? item.raffle_prize.name : item.prize}
                      </h3>
                    </div>
                    <div className={styles.raffleHistoryItemDetails}>
                      <h4 className="text-xl font-semibold leading-none tracking-tight pb-1">
                        Raffle #{item.id}
                      </h4>
                      <p className="text-sm  leading-none tracking-tight pb-2">
                        Winner:{" "}
                        {getUserName(item.winner as unknown as UserInfo)}
                      </p>
                      <div className="flex flex-col ">
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
          </ScrollArea>

          {/*
            === Можем сверху/ниже добавить TITLE, SUBTITLE
            Например, ещё одна картинка и тайтл внутри диалога
          */}
          

          {/* Кнопка «крестик» для закрытия */}
          <MorphingDialogClose className="text-zinc-500 rounded-md" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
})

export default RaffleHistoryMorphingDialog
