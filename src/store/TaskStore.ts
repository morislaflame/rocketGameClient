import { makeAutoObservable, runInAction } from "mobx";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  completeTask,
  getMyTasks,
} from "../http/taskAPI";
import { Task } from "@/types/types";


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

  // Отметить задание выполненным (увеличить прогресс, а при достижении targetCount — завершить)
  async completeTask(taskId: number) {
    try {
      this.setLoading(true);
      await completeTask(taskId);
      // После успешного выполнения обновляем список заданий с прогрессом
      await this.fetchMyTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      runInAction(() => this.setLoading(false));
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

