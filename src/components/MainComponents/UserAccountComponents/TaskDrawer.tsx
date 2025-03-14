// src/components/UserAccount/TasksDrawer.tsx
import React, { useCallback, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context, IStoreContext } from "@/store/StoreProvider";
import { Task, TaskType } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import TasksList from "./TasksList";

const TasksDrawer: React.FC = observer(() => {
  const { task, user } = useContext(Context) as IStoreContext;
  const [selectedType, setSelectedType] = useState<TaskType>("DAILY");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // При открытии диалога загружаем задания и отображаем скелетоны до окончания загрузки
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

  const handleComplete = async (taskItem: Task) => {
    try {
      // Вызываем обработчик задания
      const result = await task.handleTaskAction(taskItem);
      
      // Если в результате есть redirect, перенаправляем пользователя независимо от успеха
      if (result.redirect) {
        navigate(result.redirect);
        return; // Прерываем выполнение, так как перенаправляем
      }
      
      // Если задание было успешно выполнено, обновляем данные пользователя
      if (result.success) {
        await user.fetchMyInfo();
        // Обновляем список заданий для отображения статуса выполнения
        await task.fetchMyTasks();
      }
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Error completing task");
    }
  };

  return (
    <TasksList
      isLoading={isLoading}
      myTasks={task.myTasks}
      selectedType={selectedType}
      setSelectedType={setSelectedType}
      handleComplete={handleComplete}
      onOpen={handleTasksOpen}
    />
  );
});

export default TasksDrawer;
