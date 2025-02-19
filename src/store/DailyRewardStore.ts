// src/store/DailyRewardStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import {
  checkDailyReward,
  claimDailyReward,
} from "@/http/dailyRewardAPI";
import { DailyRewardCheckResponse, DailyRewardClaimResponse } from "@/types/types";

export default class DailyRewardStore {
  // Поля, которые приходят при check
  private _available = false;
  private _dailyRewardDay = 0;
  private _lastDailyRewardClaimAt: string | null = null;
  private _nextDay = 1;
  private _rewardInfo: {
    day: number;
    reward: number;
    rewardType: "attempts" | "tokens";
    description: string;
  } | null = null;

  private _loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Проверка ежедневной награды
  async checkDailyReward() {
    this._loading = true;
    try {
      const data: DailyRewardCheckResponse = await checkDailyReward();
      runInAction(() => {
        this._available = data.available;
        this._dailyRewardDay = data.dailyRewardDay;
        this._lastDailyRewardClaimAt = data.lastDailyRewardClaimAt;
        this._nextDay = data.nextDay;
        this._rewardInfo = data.rewardInfo; // может быть null
      });
    } catch (error) {
      console.error("Error checking daily reward:", error);
    } finally {
      runInAction(() => {
        this._loading = false;
      });
    }
  }

  // Получение ежедневной награды
  async claimDailyReward() {
    this._loading = true;
    try {
      const data: DailyRewardClaimResponse = await claimDailyReward();
      runInAction(() => {
        // Раз награда получена, флаг делаем false
        this._available = false;
        // Можно сразу обновить данные (dailyRewardDay) на те, что пришли в ответе:
        this._dailyRewardDay = data.user.dailyRewardDay;
        this._lastDailyRewardClaimAt = data.user.lastDailyRewardClaimAt;
        // rewardInfo уже не актуален, так как награду только что забрали
        this._rewardInfo = null;
      });
      return data;
    } catch (error) {
      console.error("Error claiming daily reward:", error);
    } finally {
      runInAction(() => {
        this._loading = false;
      });
    }
  }

  // Геттеры
  get available() {
    return this._available;
  }
  get dailyRewardDay() {
    return this._dailyRewardDay;
  }
  get lastDailyRewardClaimAt() {
    return this._lastDailyRewardClaimAt;
  }
  get nextDay() {
    return this._nextDay;
  }
  get rewardInfo() {
    return this._rewardInfo;
  }
  get loading() {
    return this._loading;
  }
}
