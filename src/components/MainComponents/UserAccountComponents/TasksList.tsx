import React from "react";
import { observer } from "mobx-react-lite";
import { FaCheckCircle, FaTasks } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Task, TaskType } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ListSkeleton from "../ListSkeleton";
import { getTriesImg } from "@/utils/getPlanetImg";
import { renderFormattedDescription } from "@/utils/formatUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "./UserAccountComponents.module.css";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
} from "@/components/ui/morphing-dailog";

interface TasksListProps {
  isLoading: boolean;
  myTasks: Task[];
  selectedType: TaskType;
  setSelectedType: (type: TaskType) => void;
  handleComplete: (task: Task) => Promise<void>;
  onOpen: () => Promise<void>;
}

const TasksList: React.FC<TasksListProps> = observer(({
  isLoading,
  myTasks,
  selectedType,
  setSelectedType,
  handleComplete,
  onOpen
}) => {
  const filteredTasks = myTasks.filter((t: Task) => t.type === selectedType);

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
        }}
        className="border border-gray-200/60 bg-black rounded-xl w-fit"
      >
        <div className="flex flex-col space-y-1.5 p-[12px] " onClick={onOpen}>
          <div className="flex items-center gap-2">
            <FaTasks size={16} />
            <MorphingDialogTitle className="text-[17px] font-semibold">
              Tasks
            </MorphingDialogTitle>
          </div>
          <div className="flex flex-col items-start justify-center space-y-0">
            
            <MorphingDialogSubtitle className="text-sm text-muted-foreground">
              Complete tasks and get rewards
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
            <div className="absolute top-3 left-3">
              <div className="flex items-center justify-center w-[48px] h-[48px]">
                <FaTasks size={24} />
              </div>
            </div>
            <div className="px-6">
              <MorphingDialogTitle className="text-lg font-bold">
                Tasks
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="text-sm text-gray-500">
                Complete tasks and get rewards
              </MorphingDialogSubtitle>
            </div>
          </div>

          <div className="w-full p-2 bg-black">
            <div className={styles.taskTabs}>
              <Button
                onClick={() => setSelectedType("DAILY")}
                variant={selectedType === "DAILY" ? "default" : "secondary"}
                size="sm"
              >
                Daily
              </Button>
              <Button
                onClick={() => setSelectedType("ONE_TIME")}
                variant={selectedType === "ONE_TIME" ? "default" : "secondary"}
                size="sm"
              >
                One-Time
              </Button>
              <Button
                onClick={() => setSelectedType("SPECIAL")}
                variant={selectedType === "SPECIAL" ? "default" : "secondary"}
                size="sm"
              >
                Special
              </Button>
            </div>
            
            <ScrollArea className="h-[50vh] mt-3">
              <div className={styles.topUsersList}>
                {isLoading ? (
                  <ListSkeleton count={5}/>
                ) : filteredTasks && filteredTasks.length > 0 ? (
                  filteredTasks.map((t: Task) => {
                    const userTaskData =
                      t.users && t.users.length > 0 ? t.users[0].user_task : null;
                    const progress = userTaskData ? userTaskData.progress : 0;
                    const completed = userTaskData ? userTaskData.completed : false;
                    const rewardImg =
                      t.rewardType === "attempts" ? (
                        <img src={getTriesImg()} alt="Tries" width="18" height="18" />
                      ) : null;
                    return (
                      <Card key={t.id} className={styles.topUserCard}>
                        <CardHeader className={styles.taskCardHeader}>
                          <CardTitle className={styles.taskCardTitle}>
                            {renderFormattedDescription(t.description)}
                          </CardTitle>
                          <div className={styles.taskCardReward}>
                            + {t.reward} {rewardImg}
                          </div>
                        </CardHeader>
                        <CardContent className={styles.taskCardContent}>
                          <div style={{ color: "#8E8E93", fontSize: "12px" }}>
                            {progress} / {t.targetCount}
                          </div>
                          <div className={styles.taskAction}>
                            {completed ? (
                              <FaCheckCircle color="#0dc10d" size={20} />
                            ) : (
                              <Button
                                className={styles.completeTaskBtn}
                                onClick={() => handleComplete(t)}
                              >
                                <IoIosArrowForward />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <p>No tasks available</p>
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

export default TasksList;