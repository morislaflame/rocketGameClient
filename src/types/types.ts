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
  tickets: number;
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


export interface DailyRewardCheckResponse {
  available: boolean;
  dailyRewardDay: number;
  lastDailyRewardClaimAt: string | null;
  nextDay: number;
  rewardInfo: {
    day: number;
    reward: number;
    rewardType: "attempts" | "tokens";
    description: string;
  } | null;
}

// Описание структуры, возвращаемой сервером при claimDailyReward
export interface DailyRewardClaimResponse {
  message: string;
  reward: {
    id: number;
    day: number;
    reward: number;
    rewardType: "attempts" | "tokens";
    description: string;
  };
  user: {
    dailyRewardDay: number;
    lastDailyRewardClaimAt: string;
    balance: number;
    attempts: number;
  };
}

export interface Product {
  id: number;
  name: string;
  attempts: number;
  starsPrice: number;
}

export interface RafflePackage {
  id: number;
  name: string;
  ticketCount: number;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export interface Raffle {
  id: number;
  status: string;
  startTime: string;
  endTime: string | null;
  prize: string;
  winnerUserId: number | null;
  createdAt: string;
  updatedAt: string;
  winner: null;
}

export interface CurrentRaffle {
  raffle: Raffle;
  totalTickets: number;
}

export interface RaffleHistory {
  raffle: Raffle[];
}


export interface TonConnectWallet {
  aboutUrl: string;
  account: {
    address: string;
    chain: string;
    walletStateInit: string;
    publicKey: string;
  };
  appName: string;
  bridgeUrl: string;
  deepLink: string;
  device: {
    maxProtocolVersion: number;
    appName: string;
    features: string[];
    appVersion: string;
    platform: string;
  };
  embedded: boolean;
  imageUrl: string;
  injected: boolean;
  jsBridgeKey: string;
  name: string;
  openMethod: string;
  platforms: string[];
  provider: string;
  tondns: string;
  universalLink: string;
}
