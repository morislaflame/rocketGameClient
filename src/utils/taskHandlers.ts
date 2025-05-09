import { Task } from "@/types/types";
import { toast } from "sonner";
import { PARTNERS_ROUTE, MAIN_ROUTE } from "./consts";
import TaskStore from "@/store/TaskStore";
import { TelegramWebApp } from "@/types/types";

// Тип для результата обработчика задания
export interface TaskHandlerResult {
  success: boolean;
  redirect?: string; // Опциональное поле для перенаправления
  message?: string; // Добавляем поле для сообщения
}

// Тип для функции-обработчика задания
export type TaskHandler = (task: Task, store: TaskStore, userRefCode?: string) => Promise<TaskHandlerResult>;

// Получаем доступ к телеграм объекту
const tg = window.Telegram?.WebApp as unknown as TelegramWebApp;

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
        ? "You got a prize for participating in the raffle"
        : "You need to buy at least one raffle ticket");
    
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
    toast.error("Error checking raffle participation");
    return { success: false, message: "Error checking raffle participation" };
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
      
      // Если пользователь не подписан на канал, перенаправляем его
      if (task.metadata?.channelUsername) {
        // Получаем имя канала и удаляем символ @, если он там есть
        const channelName = task.metadata.channelUsername.replace(/^@/, '');
        
        // Формируем корректный URL канала
        const channelUrl = `https://t.me/${channelName}`;
        console.log("channelUrl", channelUrl);
        
        // Логируем для отладки
        console.log("Redirecting to channel:", channelUrl);
        
        // Используем метод openTelegramLink для открытия канала
        if (tg && typeof tg.openTelegramLink === 'function') {
          tg.openTelegramLink(channelUrl);
        } else {
          // Если метод недоступен, пробуем открыть ссылку обычным способом
          window.open(channelUrl, '_blank');
        }
      }
      
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
  
  // Возвращаем успех и указываем, куда перенаправить пользователя
  return { 
    success: true, 
    redirect: PARTNERS_ROUTE,
    message: "Redirecting to partners page"
  };
};

// Обработчик для шаринга истории в Telegram
const storyShareHandler: TaskHandler = async (task: Task, store, userRefCode) => {
  try {
    // Используем метод из store для шаринга истории
    const result = await store.shareTaskToStory(task, userRefCode);
    
    if (result.success) {
      return { success: true, message: "Story published successfully" };
    } else {
      toast.error(result.message);
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("Error during story sharing:", error);
    toast.error("Error during story sharing");
    return { success: false, message: "Error during story sharing" };
  }
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
      case "STORY_SHARE":
        return storyShareHandler;
      // Здесь можно добавить другие типы заданий
      default:
        return defaultTaskHandler;
    }
  }
  
  // По умолчанию используем стандартный обработчик
  return defaultTaskHandler;
};