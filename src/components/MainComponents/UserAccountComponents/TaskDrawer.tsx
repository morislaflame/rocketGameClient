// src/components/UserAccount/TasksDrawer.tsx
import React, { useCallback, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { FaTasks, FaCheckCircle } from "react-icons/fa";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Context, IStoreContext } from "@/store/StoreProvider";
import styles from "./UserAccountComponents.module.css";
import { Task, TaskType } from "@/types/types";
import { getTriesImg } from "@/utils/getPlanetImg";
import { Button } from "@/components/ui/button";
import { IoIosArrowForward } from "react-icons/io";
import ListSkeleton from "../ListSkeleton";

const TasksDrawer: React.FC = observer(() => {
  const { task, user } = useContext(Context) as IStoreContext;
  const [selectedType, setSelectedType] = useState<TaskType>("DAILY");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // При открытии Drawer загружаем задания и отображаем скелетоны до окончания загрузки
  const handleTasksOpen = useCallback(async () => {
    try {
      setIsLoading(true);
      await task.fetchMyTasks();
    } catch (error) {
      console.error("Error during fetching my tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [task]);

  const handleComplete = async (taskId: number) => {
    try {
      await task.completeTask(taskId);
      // После успешного выполнения задания обновляем данные пользователя,
      // чтобы в Header сразу отобразилось новое количество попыток.
      await user.fetchMyInfo();
    } catch (error) {
      console.error("Ошибка при выполнении задания:", error);
    }
  };

  const filteredTasks = task.myTasks.filter((t: Task) => t.type === selectedType);

  return (
    <Drawer>
      <DrawerTrigger asChild style={{ width: "100%" }}>
        <div onClick={handleTasksOpen}>
          <UserAccCard
            title="Tasks"
            icon={<FaTasks />}
            description="Complete tasks and get rewards"
          />
        </div>
      </DrawerTrigger>
      <DrawerContent className={styles.drawerContent}>
        <DrawerHeader className={styles.drawerHeader}>
          <DrawerTitle>Tasks</DrawerTitle>
          <DrawerDescription>
            Complete tasks to earn rewards and improve your ranking.
          </DrawerDescription>
          <div className={styles.taskTabs}>
            <Button
              onClick={() => setSelectedType("DAILY")}
              variant={selectedType === "DAILY" ? "default" : "secondary"}
            >
              Daily
            </Button>
            <Button
              onClick={() => setSelectedType("ONE_TIME")}
              variant={selectedType === "ONE_TIME" ? "default" : "secondary"}
            >
              One-Time
            </Button>
            <Button
              onClick={() => setSelectedType("SPECIAL")}
              variant={selectedType === "SPECIAL" ? "default" : "secondary"}
            >
              Special
            </Button>
          </div>
        </DrawerHeader>
        <ScrollArea className="h-[70vh] w-[100%] rounded-md">
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
                        {t.description}
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
                            onClick={() => handleComplete(t.id)}
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
      </DrawerContent>
    </Drawer>
  );
});

export default TasksDrawer;
