import {makeAutoObservable, runInAction } from "mobx";
import { fetchMyInfo, fetchTopUsers, telegramAuth, check, getAvailableBonuses, generateReferralCode, getLeaderboard } from "../http/userAPI";
import { UserInfo, UserBonus, LeaderboardSettings } from "../types/types";
export default class UserStore {
    _user: UserInfo | null = null;
    _isAuth = false;
    _users: UserInfo[] = [];
    _loading = false;
    isTooManyRequests = false;
    _availableBonuses: UserBonus[] = [];
    _leaderboardSettings: LeaderboardSettings | null = null;
    _leaderboardUsers: UserInfo[] = [];
    _language: 'ru' | 'en' = 'ru';

    constructor() {
        makeAutoObservable(this);
    }

    setIsAuth(bool: boolean) {
        this._isAuth = bool;
    }

    setUser(user: UserInfo | null) {
        this._user = user;
    }

    setUsers(users: UserInfo[]) {
        this._users = users;
    }

    setLoading(loading: boolean) {
        this._loading = loading;
    }

    setTooManyRequests(flag: boolean) {
        this.isTooManyRequests = flag;
      }

      setAvailableBonuses(bonuses: UserBonus[]) {
        this._availableBonuses = bonuses;
      }

      setReferralCode(code: string) {
        if (this._user) {
            this._user.referralCode = code;
        }
      }

      setLeaderboardSettings(settings: LeaderboardSettings | null) {
        this._leaderboardSettings = settings;
      }

      setLeaderboardUsers(users: UserInfo[]) {
        this._leaderboardUsers = users;
      }

      setLanguage(lang: 'ru' | 'en') {
        this._language = lang;
        localStorage.setItem('language', lang);
      }

    async logout() {
        try {
            this.setIsAuth(false);
            this.setUser(null);
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }

    async telegramLogin(initData: string) {
        try {
            const data = await telegramAuth(initData);
            runInAction(() => {
                this.setUser(data as UserInfo);
                this.setIsAuth(true);
            });
        } catch (error) {
            console.error("Error during Telegram authentication:", error);
        }
    }
    
    async checkAuth() {
        try {
            const data = await check();
            runInAction(() => {
                this.setUser(data as UserInfo);
                this.setIsAuth(true);
            });
        } catch (error) {
            console.error("Error during auth check:", error);
            runInAction(() => {
                this.setIsAuth(false);
                this.setUser(null);
            });
        }
    }

    async fetchMyInfo() {
        try {
            const data = await fetchMyInfo();
            runInAction(() => {
                this.setUser(data as UserInfo);
            });
            
        } catch (error) {
            console.error("Error during fetching my info:", error);
        }
    }

    async fetchTopUsers() {
        try {
            const data = await fetchTopUsers();
            runInAction(() => {
                this.setUsers(data as UserInfo[]);
            });
        } catch (error) {
            console.error("Error during fetching top users:", error);
        }
    }

    async fetchAvailableBonuses() {
        try {
            const data = await getAvailableBonuses();
            runInAction(() => {
                this.setAvailableBonuses(data as UserBonus[]);
            });
        } catch (error) {
            console.error("Error during fetching available bonuses:", error);
        }
    }

    async generateReferralCode() {
        try {
            const data = await generateReferralCode();
            runInAction(() => {
                this.setReferralCode(data.referralCode as string);
            });
        } catch (error) {
            console.error("Error during generating referral code:", error);
        }
    }
    
    async fetchLeaderboard() {
        try {
            const data = await getLeaderboard();
            runInAction(() => {
                this.setLeaderboardUsers(data.users);
                if (data.settings && data.settings.isActive) {
                    this.setLeaderboardSettings(data.settings);
                } else {
                    this.setLeaderboardSettings(null);
                }
                this.setUsers(data.users);
            });
            return data;
        } catch (error) {
            console.error("Error during fetching leaderboard:", error);
            throw error;
        }
    }

    get availableBonuses() {
        return this._availableBonuses;
    }
    
    get users() {
        return this._users;
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }

    get loading() {
        return this._loading;
    }

    get referralCode() {
        return this._user?.referralCode;
    }

    get leaderboardSettings() {
        return this._leaderboardSettings;
    }
    
    get leaderboardUsers() {
        return this._leaderboardUsers;
    }

    get language() {
        return this._language;
    }
}
