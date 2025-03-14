import React from "react";
import { observer } from "mobx-react-lite";
import { MdLeaderboard } from "react-icons/md";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserInfo } from '@/types/types';
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
}

// Функция для расчета награды в зависимости от позиции
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
  onOpen
}) => {
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
            <div className={styles.totalRewardsPool}>
              <p>Prize pool: 5000 </p>
              <img src={tonImg} alt="TON" 
              style={{ width: "20px", height: "20px", verticalAlign: "middle", }}/>
            </div>
            
            <ScrollArea className="h-[50vh] mt-3">
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
                          {calculateReward(index + 1) > 0 && (
                            <span className="flex flex-row items-center gap-1 justify-center">
                              {` • ${calculateReward(index + 1)}`} <img src={tonImg} alt="TON" style={{ width: "16px", height: "16px", verticalAlign: "middle" }} />
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