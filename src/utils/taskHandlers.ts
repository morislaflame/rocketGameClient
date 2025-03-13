import { Task } from "@/types/types";
import { toast } from "sonner";
import { PARTNERS_ROUTE, MAIN_ROUTE } from "./consts";
import TaskStore from "@/store/TaskStore";

// Тип для результата обработчика задания
export interface TaskHandlerResult {
  success: boolean;
  redirect?: string; // Опциональное поле для перенаправления
  message?: string; // Добавляем поле для сообщения
}

// Тип для функции-обработчика задания
export type TaskHandler = (task: Task, store: TaskStore) => Promise<TaskHandlerResult>;

// Обработчик для обычных заданий (стандартное выполнение)
const defaultTaskHandler: TaskHandler = async (task: Task, store) => {
  try {
    await store.completeTask(task.id);
    toast.success("Task completed successfully");
    return { success: true, message: "Task completed successfully" };
  } catch (error) {
    console.error("Error completing task:", error);
    toast.error("Error completing task");
    return { success: false, message: "Error completing task" };
  }
};

// Обработчик для проверки участия в розыгрыше
const raffleParticipationHandler: TaskHandler = async (task: Task, store) => {
  try {
    const result = await store.checkRaffleParticipation(task.id);
    
    // Логируем ответ для диагностики
    console.log("Raffle participation check response:", result);
    
    const message = result.message || (result.success 
        ? "Вы получили награду за участие в розыгрыше"
        : "Вам необходимо купить хотя бы один билет розыгрыша");
    
    if (result.success) {
      toast.success(message);
      return { success: true, message };
    } else {
      toast.error(message);
      // Добавляем редирект на MAIN_ROUTE при неуспешной проверке участия
      return { 
        success: false, 
        message,
        redirect: MAIN_ROUTE 
      };
    }
  } catch (error) {
    console.error("Error checking raffle participation:", error);
    toast.error("Ошибка проверки участия в розыгрыше");
    return { success: false, message: "Ошибка проверки участия в розыгрыше" };
  }
};

// Обработчик для проверки подписки на Telegram канал
const telegramSubscriptionHandler: TaskHandler = async (task: Task, store) => {
  try {
    const result = await store.checkChannelSubscription(task.id);
    
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
      case "RAFFLE_PART":
        return raffleParticipationHandler;
      // Здесь можно добавить другие типы заданий
      default:
        return defaultTaskHandler;
    }
  }
  
  // По умолчанию используем стандартный обработчик
  return defaultTaskHandler;
};