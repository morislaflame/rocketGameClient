import { $authHost, $host } from "./index";
import { Task } from "../types/types";

// Создание нового задания (админский метод)
export const createTask = async (taskData: Task) => {
  const { data } = await $authHost.post('api/task', taskData);
  return data;
};

// Обновление задания по id (админский метод)
export const updateTask = async (id: number, taskData: Task) => {
  const { data } = await $authHost.put(`api/task/${id}`, taskData);
  return data;
};

// Удаление задания по id (админский метод)
export const deleteTask = async (id: number) => {
  const { data } = await $authHost.delete(`api/task/${id}`);
  return data;
};

// Получение списка всех заданий (с возможностью фильтрации по типу)
export const getTasks = async (type: string) => {
  let url = 'api/task';
  if (type) {
    url += `?type=${type}`;
  }
  const { data } = await $host.get(url);
  return data;
};

// Отметить выполнение задания (увеличение прогресса/завершение)
export const completeTask = async (taskId: number) => {
  const { data } = await $authHost.post('api/task/complete', { taskId });
  return data;
};

// Получение списка заданий с данными о прогрессе для текущего пользователя
export const getMyTasks = async () => {
  const { data } = await $authHost.get('api/task/my');
  return data;
};
