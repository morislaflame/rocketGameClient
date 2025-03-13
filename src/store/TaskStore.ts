import { makeAutoObservable, runInAction } from "mobx";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getMyTasks,
  checkChannelSubscription,
  checkRaffleParticipation,
  completeTask,
} from "../http/taskAPI";
import { Task } from "@/types/types";
import { getTaskHandler } from "@/utils/taskHandlers";
import { TelegramWebApp } from "@/types/types";

// Получаем доступ к телеграм объекту
const tg = window.Telegram?.WebApp as unknown as TelegramWebApp;

export default class TaskStore {
  _tasks: Task[] = [];
  _myTasks: Task[] = [];
  _loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setTasks(tasks: Task[]) {
    this._tasks = tasks;
  }

  setMyTasks(tasks: Task[]) {
    this._myTasks = tasks;
  }

  setLoading(loading: boolean) {
    this._loading = loading;
  }

  // Получение списка всех заданий (для админа или общего просмотра)
  async fetchTasks(filterType: string) {
    try {
      this.setLoading(true);
      const data = await getTasks(filterType);
      runInAction(() => {
        this.setTasks(data);
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  // Получение списка заданий с информацией о прогрессе для текущего пользователя
  async fetchMyTasks() {
    try {
      this.setLoading(true);
      const data = await getMyTasks();
      runInAction(() => {
        this.setMyTasks(data);
      });
    } catch (error) {
      console.error("Error fetching my tasks:", error);
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  // Создание нового задания (обычно админский функционал)
  async createTask(taskData: Task) {
    try {
      this.setLoading(true);
      const data = await createTask(taskData);
      runInAction(() => {
        this._tasks.push(data);
      });
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  // Обновление задания по id (админский функционал)
  async updateTask(id: number, taskData: Task) {
    try {
      this.setLoading(true);
      const data = await updateTask(id, taskData);
      runInAction(() => {
        this._tasks = this._tasks.map((task) => (task.id === id ? data : task));
      });
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  // Удаление задания по id (админский функционал)
  async deleteTask(id: number) {
    try {
      this.setLoading(true);
      await deleteTask(id);
      runInAction(() => {
        this._tasks = this._tasks.filter((task) => task.id !== id);
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  // Обновленный метод для выполнения задания с учетом типа
  async handleTaskAction(task: Task) {
    try {
      this.setLoading(true);
      const taskHandler = getTaskHandler(task);
      const result = await taskHandler(task, this);
      
      // Возвращаем результат обработки, включая возможное перенаправление
      return result;
    } catch (error) {
      console.error("Error handling task:", error);
      return { success: false };
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  // Метод для выполнения задания
  async completeTask(taskId: number) {
    const result = await completeTask(taskId);
    return result;
  }

  // Проверка подписки на Telegram канал
  async checkChannelSubscription(taskId: number) {
    try {
      this.setLoading(true);
      const result = await checkChannelSubscription(taskId);
      return result;
    } catch (error) {
      console.error("Error checking channel subscription:", error);
      throw error;
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  // Проверка участия в розыгрыше
  async checkRaffleParticipation(taskId: number) {
    try {
      this.setLoading(true);
      const result = await checkRaffleParticipation(taskId);
      return result;
    } catch (error) {
      console.error("Error checking raffle participation:", error);
      throw error;
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  // Метод для шаринга истории в Telegram
  async shareTaskToStory(task: Task) {
    try {
      // Проверяем наличие метода shareToStory в объекте Telegram
      if (!tg || typeof tg.shareToStory !== 'function') {
        console.error("Telegram shareToStory method is not available");
        return { success: false, message: "Функция поделиться историей недоступна" };
      }
      
      // Получаем параметры шаринга из metadata задания, если они есть
      const mediaUrl = task.metadata?.mediaUrl || 'https://example.com/placeholder.jpg';
      const shareText = task.metadata?.shareText || 'Посмотрите на мои достижения!';
      const widgetName = task.metadata?.widgetName || 'Открыть приложение';
      const widgetUrl = task.metadata?.widgetUrl || '';
      
      // Логируем вызов функции для отладки
      console.log("Вызов shareToStory с параметрами:", {
        mediaUrl,
        shareText,
        widgetName,
        widgetUrl
      });
      
      // Вызываем функцию shareToStory
      tg.shareToStory(mediaUrl, {
        text: shareText,
        widget_link: {
          url: widgetUrl,
          name: widgetName
        }
      });
      
      // Логируем успешный вызов
      console.log("Функция shareToStory успешно вызвана");
      
      // Отмечаем задание как выполненное на сервере
      await this.completeTask(task.id);
      
      return { success: true, message: "История успешно опубликована" };
      
    } catch (error) {
      console.error("Error during story sharing:", error);
      return { success: false, message: "Ошибка при публикации истории" };
    }
  }

  get tasks() {
    return this._tasks;
  }

  get myTasks() {
    return this._myTasks;
  }

  get loading() {
    return this._loading;
  }
}

