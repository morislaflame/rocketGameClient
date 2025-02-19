// src/components/UserAccount/TasksDrawer.tsx
import React, { useContext, useEffect, useState } from "react";
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
import { Context } from "@/main";
import styles from "./UserAccountComponents.module.css";
import { Task, TaskType } from "@/types/types";
import { getTriesImg } from "@/utils/getPlanetImg";
import { Button } from "@/components/ui/button";
import { IoIosArrowForward } from "react-icons/io";

const TasksDrawer: React.FC = observer(() => {
  const { task, user } = useContext(Context);
  const [selectedType, setSelectedType] = useState<TaskType>("DAILY");

  // При монтировании (или открытии) запрашиваем задания пользователя
  useEffect(() => {
    task.fetchMyTasks();
  }, [task]);

  const handleComplete = async (taskId: number) => {
    try {
      await task.completeTask(taskId);
      // После успешного выполнения задания обновляем данные пользователя,
      // чтобы в Header сразу отобразилось новое количество попыток.
      await user.fetchMyInfo();
    //   await task.fetchMyTasks();
    } catch (error) {
      console.error("Ошибка при выполнении задания:", error);
    }
  };

  const filteredTasks = task.myTasks.filter((t: Task) => t.type === selectedType);

  return (
    <Drawer>
      <DrawerTrigger asChild style={{ width: "100%" }}>
        <div>
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
            variant={selectedType === "DAILY" ? "secondary" : "default"}
          >
            Daily
          </Button>
          <Button
            onClick={() => setSelectedType("ONE_TIME")}
            variant={selectedType === "ONE_TIME" ? "secondary" : "default"}
          >
            One-Time
          </Button>
          <Button
            onClick={() => setSelectedType("SPECIAL")}
            variant={selectedType === "SPECIAL" ? "secondary" : "default"}
          >
            Special
            </Button>
          </div>
        </DrawerHeader>
        <ScrollArea className="h-[70vh] w-[100%] rounded-md">
          <div className={styles.topUsersList}>
            {filteredTasks && filteredTasks.length > 0 ? (
              filteredTasks.map((t: Task) => {
                // Ожидается, что в join-данных будет массив users с данными из таблицы UserTask
                const userTaskData =
                  t.users && t.users.length > 0 ? t.users[0].user_task : null;
                const progress = userTaskData ? userTaskData.progress : 0;
                const completed = userTaskData ? userTaskData.completed : false;
                const rewardImg =
                  t.rewardType === "attempts" ? (
                    <img src={getTriesImg()} alt="Tries" />
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
