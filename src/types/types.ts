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
  referralCode: string | null;
  referrerId: number | null;
  imageUrl: string | null;
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
  code: string;
  metadata: Record<string, string>;
  // Если задачи получены с join-данными, то сюда попадёт массив пользователей с информацией о выполнении задания
  users?: TaskUser[];
}

export interface TasksResponse {
  success: boolean;
  message: string;
  completed: boolean;
  reward?: {
    amount: number;
    type: RewardType;
  };
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

// Возможные статусы приза
export type PrizeStatus = 'pending' | 'sold' | 'received';

// Интерфейс для приза из розыгрыша
export interface RafflePrize {
  id: number;
  name: string;
  imageUrl: string;
  value: number;
  description: string | null;
  media_file: {
            id: number;
            fileName: string;
            originalName: string;
            mimeType: string;
            size: number;
            bucket: string;
            url: string;
            entityType: string;
            entityId: number;
            createdAt: string;
            updatedAt: string;
            userId: number;
        }
}

// Интерфейс для пользовательского приза
export interface UserPrize {
  id: number;
  raffleId: number;
  status: string;
  winDate: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  rafflePrizeId: number;
  raffle: {
    id: number;
    startTime: string;
    endTime: string;
    totalTickets: number;
    raffle_prize: RafflePrize;
    };
};

export interface Raffle {
  id: number;
  status: string;
  startTime: string;
  endTime: string | null;
  prize: string;
  winnerUserId: number | null;
  totalTickets: number;
  createdAt: string;
  updatedAt: string;
  thresholdReachedAt: string | null;
  winnerChance: number | null;
  timerActive: boolean;
  winningTicketNumber: number | null;
  ticketThreshold: number;
  raffleDuration: number;
  winner: {
    id: number;
    username: string | null;
    telegramId: number | null;
  } | null;
  raffle_prize: RafflePrize | null;
}

export interface RecentParticipant {
  userId: number;
  username: string | null;
  lastParticipation: string;
}

export interface CurrentRaffle {
  raffle: Raffle;
  totalTickets: number;
  totalParticipants: number;
  recentParticipants: RecentParticipant[];
}

export interface SelectedRaffle {
  raffle: Raffle;
  totalTickets: number;
  timerActive: boolean;
  totalParticipants: number;
  recentParticipants: RecentParticipant[];
}

export interface PreviousRaffle {
  raffle: Raffle;
  totalTickets: number;
  totalParticipants: number;
  recentParticipants: RecentParticipant[];
}

export interface RaffleTicket {
  id: number;
  ticketNumber: number;
  purchasedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserTickets {
  raffle: Raffle;
  tickets: RaffleTicket[];
  userTicketsCount: number;
  totalRaffleTickets: number;
  totalUserTickets: number;
  chance: string;
  timerActive: boolean;
}

export interface RaffleHistoryItem {
  id: number;
  status: string;
  startTime: string;
  endTime: string;
  prize: string;
  winnerUserId: number | null;
  totalTickets: number;
  winningTicketNumber: number | null;
  thresholdReachedAt: string | null;
  timerActive: boolean;
  createdAt: string;
  updatedAt: string;
  prizeId: number | null;
  rafflePrizeId: number | null;
  winner: {
      id: number;
      username: string | null;
      telegramId: string | null;
  } | null;
  raffle_prize: RafflePrize | null;
  winnerChance?: number;
}

export type RaffleHistory = RaffleHistoryItem[];

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


export interface UserBonus {
  id: number;
  bonusType: string;
  isUsed: boolean;
  createdAt: string;
  usedAt: string | null;
}

export type UserBonuses = UserBonus[];


export interface RefferalSpent {
  date: string;
  totalSpent: string;
}

export interface Referral {
  data: RefferalSpent[];
  totalSpent: number;
  totalEarned: number;
  page: number;
  limit: number;
  totalItems: number;
}

export interface LeaderboardSettings {
  id: number;
  isActive: boolean;
  endDate: string | null;
  prizeType: 'money' | 'physical';
  totalMoneyPool: number | null;
  placePrizes: LeaderboardPlacePrize[];
}

export interface LeaderboardPlacePrize {
  id: number;
  place: number;
  moneyAmount?: number;
  rafflePrizeId?: number;
  rafflePrize?: RafflePrize;
}


export interface TelegramWebApp {
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  initData: {
    user: {
      id: number;
      first_name: string;
      last_name: string;
      username: string;
      photo_url: string;
    };
  };
  openInvoice: (url?: string, callback?: () => void) => void;
  shareToStory: (media_url: string, params: {
     text: string;
     widget_link: {
      url: string;
      name: string;
     }
  }) => void;
  openTelegramLink: (url: string) => void;
}


export enum PrizeType {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  SPECIAL = 'special',
}

// Prize item interface
export interface PrizeItem {
  id: string | number;
  image: string;
  text?: string;
  type?: PrizeType;
  isSpecial?: boolean;
  [key: string]: any;
}