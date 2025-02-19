// Возможные значения для типа задания
export type TaskType = 'DAILY' | 'ONE_TIME' | 'SPECIAL';

// Возможные значения для типа награды
export type RewardType = 'attempts' | 'tokens';

// Тип для данных из промежуточной таблицы UserTask
export interface UserTaskInfo {
  progress: number;
  completed: boolean;
  completedAt: string | null;
}

// Интерфейс пользователя
export interface UserInfo {
  id: number;
  email: string | null;
  telegramId: number;
  username: string | null;
  role: string;
  balance: number;
  isTonConnected: boolean;
  tonAddress: string | null;
  premium: boolean;
  attempts: number;
  // Если нужно, можно добавить другие поля
}

// При получении задач через include join-данных, пользователь может содержать дополнительное поле
export interface TaskUser extends UserInfo {
  // Поле с данными из промежуточной таблицы (имя зависит от alias в запросе, по умолчанию "user_task")
  user_task?: UserTaskInfo;
}

// Интерфейс задачи
export interface Task {
  id: number;
  type: TaskType;
  reward: number;
  rewardType: RewardType;
  description: string;
  targetCount: number;
  // Если задачи получены с join-данными, то сюда попадёт массив пользователей с информацией о выполнении задания
  users?: TaskUser[];
}
