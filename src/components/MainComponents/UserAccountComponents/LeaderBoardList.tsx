import React from "react";
import { observer } from "mobx-react-lite";
import { MdLeaderboard } from "react-icons/md";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserInfo, LeaderboardSettings } from '@/types/types';
import { getUserName } from '@/utils/getUserName';
import { getPlanetImg } from '@/utils/getPlanetImg';
import ListSkeleton from '../ListSkeleton';
import styles from './UserAccountComponents.module.css';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
} from "@/components/ui/morphing-dailog";

import tonImg from "@/assets/TonIcon.svg";

interface LeaderBoardListProps {
  isLoading: boolean;
  users: UserInfo[];
  onOpen: () => Promise<void>;
  settings?: LeaderboardSettings;
}

// Функция для расчета награды в зависимости от позиции
// Оставляем для обратной совместимости, если настройки не загружены
const calculateReward = (position: number): number => {
  if (position === 1) return 1000;
  if (position === 2) return 700;
  if (position === 3 || position === 4) return 500;
  if (position === 5) return 300;
  if (position === 6 || position === 7) return 150;
  if (position === 8 || position === 9) return 100;
  // Для остальных - 50 TON (до исчерпания общего пула)
  if (position >= 10 && position <= 39) return 50;
  return 0;
};

const LeaderBoardList: React.FC<LeaderBoardListProps> = observer(({
  isLoading,
  users,
  onOpen,
  settings
}) => {
  // Получаем приз для места из настроек
  const getPrizeForPlace = (place: number) => {
    if (!settings || !settings.placePrizes) return null;
    
    return settings.placePrizes.find(prize => prize.place === place);
  };

  // Проверяем, есть ли приз для позиции
  const hasRewardForPosition = (position: number) => {
    if (settings?.placePrizes) {
      return !!getPrizeForPlace(position);
    }
    return calculateReward(position) > 0;
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
        className="border border-gray-200/60 rounded-xl w-fit"
      >
        <div className="flex flex-col space-y-1.5 p-[12px] " onClick={onOpen}>
          <div className="flex items-center gap-2">
            <MdLeaderboard size={16} />
            <MorphingDialogTitle className="text-[16px] font-semibold">
              Leaderboard
            </MorphingDialogTitle>
          </div>
          <div className="flex flex-col items-start justify-center space-y-0">
            <MorphingDialogSubtitle className="text-sm text-muted-foreground">
              View your position on the leaderboard
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
                <MdLeaderboard size={24} />
              </div>
            </div>
            <div className="px-6 flex flex-col items-center justify-center gap-1">
              <MorphingDialogTitle className="text-lg font-bold">
                Leaderboard
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="text-sm text-gray-500 w-[70%]">
                The most active users will receive more rewards
              </MorphingDialogSubtitle>
            </div>
          </div>

          <div className="w-full p-2 bg-black">
            {/* Отображение даты окончания и информации о призовом фонде только если есть активные настройки */}
            {settings?.isActive && (
              <>
                {/* Блок с датой окончания */}
                {settings.endDate && (
                  <div className={styles.endDateBlock || "text-center mb-2"}>
                    <p className="text-sm text-gray-400">
                      Rewards on {new Date(settings.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {settings.prizeType === 'money' ? (
                  // Для денежных призов показываем общий фонд
                  <div className={styles.totalRewardsPool}>
                    <p>Prize pool: {settings.totalMoneyPool} </p>
                    <img src={tonImg} alt="TON" 
                    style={{ width: "20px", height: "20px", verticalAlign: "middle", }}/>
                  </div>
                ) : (
                  // Для физических призов показываем список призов по местам
                  <div className={styles.physicalPrizesList}>
                    <div className="grid grid-cols-1 gap-1">
                      {settings.placePrizes
                        .slice() // Создаем копию массива перед сортировкой
                        .sort((a, b) => a.place - b.place)
                        .filter(prize => prize.rafflePrize)
                        .map(prize => (
                          <div key={prize.id} className="flex items-center justify-between p-1 border-b border-gray-900" id='physical-prize-item'>
                            <span className="font-sm text-gray-400">#{prize.place}</span>
                            <div className="flex items-center gap-1">
                              <span className="font-sm text-gray-500">{prize.rafflePrize?.name}</span>
                              {prize.rafflePrize?.imageUrl && (
                                <img 
                                  src={prize.rafflePrize.imageUrl} 
                                  alt={prize.rafflePrize.name} 
                                  style={{ width: "40px", height: "40px", borderRadius: "4px" }}
                                />
                              )}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </>
            )}
            
            <ScrollArea className="h-[45vh] mt-3">
              <div className={styles.topUsersList}>
                {isLoading ? (
                  <ListSkeleton count={5}/>
                ) : users.length ? (
                  users.map((u: UserInfo, index: number) => (
                    <Card key={u.id} className={styles.topUserCard}>
                      <CardHeader className={styles.topUserCardHeader}>
                        <CardTitle className={styles.topUserCardTitle}>
                          {getUserName(u)}
                        </CardTitle>
                        <CardDescription style={{ color: "#8E8E93" }} className='flex flex-row items-center gap-2'>
                          #{index + 1} 
                          {/* Показываем приз только если это денежный приз и настройки активны */}
                          {settings?.isActive && settings.prizeType === 'money' && hasRewardForPosition(index + 1) && (
                            <span className="flex flex-row items-center gap-1 justify-center">
                              {` • ${settings.placePrizes.find(p => p.place === index + 1)?.moneyAmount || calculateReward(index + 1)}`} 
                              <img src={tonImg} alt="TON" style={{ width: "16px", height: "16px", verticalAlign: "middle" }} />
                            </span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className={styles.topUserCardContent}>
                        {u.balance} <img src={getPlanetImg()} alt="Planet" width={"18px"} height={"18px"}/>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p>No users found</p>
                )}
              </div>
            </ScrollArea>
          </div>

          <MorphingDialogClose className="text-zinc-500 rounded-md" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
});

export default LeaderBoardList;