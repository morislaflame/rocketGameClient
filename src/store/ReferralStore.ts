import { makeAutoObservable, runInAction } from "mobx";
import { getReferralsSpentByDay } from "@/http/referralAPI";

interface SpentDay {
  date: string;
  totalSpent: number;
}

export default class ReferralStore {
  _referrals: SpentDay[] = [];
  _totalSpent = 0;
  _totalEarned = 0;
  _page = 1;
  _limit = 30;
  _totalItems = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setReferrals(referrals: SpentDay[]) {
    this._referrals = referrals;
  }
  setTotalSpent(value: number) {
    this._totalSpent = value;
  }
  setTotalEarned(value: number) {
    this._totalEarned = value;
  }
  setPage(page: number) {
    this._page = page;
  }
  setLimit(limit: number) {
    this._limit = limit;
  }
  setTotalItems(total: number) {
    this._totalItems = total;
  }

  async fetchReferralsSpentByDay(year?: number, month?: number) {
    try {
      const result = await getReferralsSpentByDay(year, month, this._page, this._limit);
      runInAction(() => {
        this._referrals = result.data; // массив с {date, totalSpent}
        this._totalSpent = result.totalSpent;
        this._totalEarned = result.totalEarned;
        this._page = result.page;
        this._limit = result.limit;
        this._totalItems = result.totalItems;
      });
    } catch (error) {
      console.error("Error fetching referrals spent data:", error);
    }
  }

  get referrals() {
    return this._referrals;
  }
  get totalSpent() {
    return this._totalSpent;
  }
  get totalEarned() {
    return this._totalEarned;
  }
  get page() {
    return this._page;
  }
  get limit() {
    return this._limit;
  }
  get totalItems() {
    return this._totalItems;
  }
}
