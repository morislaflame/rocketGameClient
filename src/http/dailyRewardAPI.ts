// src/http/dailyRewardAPI.ts
import { $authHost } from "./index";

/**
 * Ответ при проверке награды:
 * {
 *   available: boolean;
 *   dailyRewardDay: number;
 *   lastDailyRewardClaimAt: string | null;
 * }
 */
export const checkDailyReward = async () => {
  const { data } = await $authHost.get("api/daily-reward/check");
  return data; // Возвращает объект с полями: { available, dailyRewardDay, lastDailyRewardClaimAt }
};

/**
 * Ответ при получении награды:
 * {
 *   message: string;
 *   reward: {
 *     id: number;
 *     day: number;
 *     reward: number;
 *     rewardType: 'attempts' | 'tokens';
 *     description: string;
 *   },
 *   user: {
 *     dailyRewardDay: number;
 *     lastDailyRewardClaimAt: string;
 *     balance: number;
 *     attempts: number;
 *   }
 * }
 */
export const claimDailyReward = async () => {
  const { data } = await $authHost.post("api/daily-reward/claim");
  return data;
};
