import { Task } from "@/types/types";
import { checkChannelSubscription, completeTask } from "@/http/taskAPI";
import { toast } from "sonner";
import { PARTNERS_ROUTE } from "./consts";

// Тип для результата обработчика задания
export interface TaskHandlerResult {
  success: boolean;
  redirect?: string; // Опциональное поле для перенаправления
  message?: string; // Добавляем поле для сообщения
}

// Тип для функции-обработчика задания
export type TaskHandler = (task: Task) => Promise<TaskHandlerResult>;

// Обработчик для обычных заданий (стандартное выполнение)
const defaultTaskHandler: TaskHandler = async (task: Task) => {
  try {
    await completeTask(task.id);
    toast.success("Task completed successfully"); // Добавляем уведомление по умолчанию
    return { success: true, message: "Task completed successfully" };
  } catch (error) {
    console.error("Error completing task:", error);
    toast.error("Error completing task"); // Добавляем уведомление об ошибке
    return { success: false, message: "Error completing task" };
  }
};

// Обработчик для проверки подписки на Telegram канал
const telegramSubscriptionHandler: TaskHandler = async (task: Task) => {
  try {
    // Передаем taskId вместо кода, чтобы на бэкенде можно было 
    // получить конкретное задание и его метаданные
    const result = await checkChannelSubscription(task.id);
    
    // Логируем ответ для диагностики
    console.log("Telegram subscription check response:", result);
    
    // Убедимся, что сообщение существует
    const message = result.message || (result.success 
        ? "Subscription confirmed"
        : "Error checking subscription");
    
    if (result.success) {
      // Принудительно вызываем toast при успехе
      toast.success(message);
      return { success: true, message };
    } else {
      // Принудительно вызываем toast при ошибке
      toast.error(message);
      return { success: false, message };
    }
  } catch (error) {
    console.error("Error checking channel subscription:", error);
    toast.error("Error checking channel subscription");
    return { success: false, message: "Error checking channel subscription" };
  }
};

// Обработчик для реферальной программы - просто перенаправляет на страницу партнеров
const referralBonusHandler: TaskHandler = async () => {
  // Добавляем уведомление для реферальной программы
  toast.info("Redirecting to partners page");
  
  // Возвращаем успех и указываем, куда перенаправить пользователя
  return { 
    success: true, 
    redirect: PARTNERS_ROUTE,
    message: "Redirecting to partners page"
  };
};

// Определяем обработчики по типу задания (коду)
export const getTaskHandler = (task: Task): TaskHandler => {
  // Если у задания есть код, выбираем соответствующий обработчик
  if (task.code) {
    switch (task.code) {
      case "TELEGRAM_SUB":
        return telegramSubscriptionHandler;
      case "REFERRAL_BONUS":
        return referralBonusHandler;
      // Здесь можно добавить другие типы заданий
      default:
        return defaultTaskHandler;
    }
  }
  
  // По умолчанию используем стандартный обработчик
  return defaultTaskHandler;
};