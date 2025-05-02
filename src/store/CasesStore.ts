import { makeAutoObservable, runInAction } from "mobx";
import { 
  fetchCases, 
  fetchOneCase, 
  openCase, 
  checkFreeCaseAvailability, 
  fetchUserCaseHistory,
  initCasePurchaseTON,
  getCaseTransactionStatus,
  cancelCaseTransaction,
  fetchUserCases,
  generateCaseInvoice,
  purchaseCaseWithPoints
} from "../http/casesAPI";
import { Case, CaseHistory, CaseOpenResult, FreeCaseAvailability, TelegramWebApp } from "@/types/types";
import { getStore } from "./StoreProvider"; // Импортируем функцию доступа к хранилищу

const tg = window.Telegram?.WebApp as unknown as TelegramWebApp;

export default class CasesStore {
  _cases: Case[] = [];
  _selectedCase: Case | null = null;
  _caseHistory: CaseHistory | null = null;
  _freeAvailability: { [key: number]: FreeCaseAvailability } = {};
  _openResult: CaseOpenResult | null = null;
  _loading = false;
  _error = "";
  _userCases: any[] = [];
  _loadingPurchase: boolean = false;
  _loadingUserCases: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setCases(cases: Case[]) {
    this._cases = cases;
  }

  setSelectedCase(caseData: Case | null) {
    this._selectedCase = caseData;
  }

  setCaseHistory(history: CaseHistory | null) {
    this._caseHistory = history;
  }

  setFreeAvailability(caseId: number, availability: FreeCaseAvailability) {
    this._freeAvailability = { ...this._freeAvailability, [caseId]: availability };
  }

  setOpenResult(result: CaseOpenResult | null) {
    this._openResult = result;
  }

  setLoading(loading: boolean) {
    this._loading = loading;
  }

  setError(error: string) {
    this._error = error;
  }

  setUserCases(cases: any[]) {
    this._userCases = cases;
  }

  setLoadingPurchase(loading: boolean) {
    this._loadingPurchase = loading;
  }

  setLoadingUserCases(loading: boolean) {
    this._loadingUserCases = loading;
  }

  // Получение всех кейсов с опциональной фильтрацией
  async fetchCases(params = {}) {
    try {
      this.setLoading(true);
      this.setError("");
      const data = await fetchCases(params);
      runInAction(() => {
        this.setCases(data);
      });
    } catch (error) {
      runInAction(() => {
        console.error("Error fetching cases:", error);
        this.setError("Failed to load cases");
      });
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  // Получение конкретного кейса по ID
  async fetchOneCase(id: number) {
    try {
      this.setLoading(true);
      this.setError("");
      const data = await fetchOneCase(id);
      runInAction(() => {
        this.setSelectedCase(data);
      });
      return data;
    } catch (error) {
      runInAction(() => {
        console.error(`Error fetching case ${id}:`, error);
        this.setError("Failed to load case details");
      });
      return null;
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  // Открытие кейса
  async openCase(caseId: number) {
    try {
      this.setLoading(true);
      this.setError("");
      const data = await openCase(caseId);
      runInAction(() => {
        this.setOpenResult(data);
      });
      return data;
    } catch (error: any) {
      runInAction(() => {
        console.error(`Error opening case ${caseId}:`, error);
        this.setError(error?.response?.data?.message || "Failed to open case");
      });
      return null;
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  // Проверка доступности бесплатного кейса
  async checkFreeCaseAvailability(caseId: number) {
    try {
      this.setLoading(true);
      this.setError("");
      const data = await checkFreeCaseAvailability(caseId);
      runInAction(() => {
        this.setFreeAvailability(caseId, data);
      });
      return data;
    } catch (error) {
      runInAction(() => {
        console.error(`Error checking free case availability for case ${caseId}:`, error);
        this.setError("Failed to check free case availability");
      });
      return null;
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  // Получение истории открытия кейсов
  async fetchUserCaseHistory(params = {}) {
    try {
      this.setLoading(true);
      this.setError("");
      const data = await fetchUserCaseHistory(params);
      runInAction(() => {
        this.setCaseHistory(data);
      });
      return data;
    } catch (error) {
      runInAction(() => {
        console.error("Error fetching case history:", error);
        this.setError("Failed to load case history");
      });
      return null;
    } finally {
      runInAction(() => this.setLoading(false));
    }
  }

  // Сброс текущего открытого результата
  resetOpenResult() {
    this.setOpenResult(null);
  }

  // Очистка состояния для выбранного кейса
  clearSelectedCase() {
    this.setSelectedCase(null);
  }

  // Инициализация покупки кейса за TON
  async initCasePurchase(
    userId: number,
    caseId: number,
    rawPayload: string,
    uniqueId: string,
    quantity: number = 1
  ) {
    try {
      this.setLoadingPurchase(true);
      const result = await initCasePurchaseTON(
        userId,
        caseId,
        rawPayload,
        uniqueId,
        quantity
      );
      return result;
    } catch (error) {
      console.error("Error initiating case purchase:", error);
      this.setError("Failed to initiate case purchase");
      return null;
    } finally {
      this.setLoadingPurchase(false);
    }
  }

  // Проверка статуса транзакции
  async checkTransactionStatus(userId: number, uniqueId: string) {
    try {
      const status = await getCaseTransactionStatus(userId, uniqueId);
      return status;
    } catch (error) {
      console.error("Error checking transaction status:", error);
      this.setError("Failed to check transaction status");
      return null;
    }
  }

  // Отмена транзакции
  async cancelTransaction(userId: number, uniqueId: string, errorType: string) {
    try {
      const result = await cancelCaseTransaction(userId, uniqueId, errorType);
      return result;
    } catch (error) {
      console.error("Error cancelling transaction:", error);
      this.setError("Failed to cancel transaction");
      return null;
    }
  }

  // Получение купленных кейсов пользователя
  async fetchUserCases(params = {}) {
    try {
      this.setLoadingUserCases(true);
      const data = await fetchUserCases(params);
      runInAction(() => {
        this.setUserCases(data.rows || []);
      });
      return data;
    } catch (error) {
      runInAction(() => {
        console.error("Error fetching user cases:", error);
        this.setError("Failed to load user cases");
      });
      return null;
    } finally {
      runInAction(() => this.setLoadingUserCases(false));
    }
  }

  // Генерация счета Telegram для оплаты звездами
  async generateInvoice(caseId: number, quantity: number = 1) {
    try {
      this.setLoadingPurchase(true);
      const invoiceLink = await generateCaseInvoice(caseId, quantity);
      try {
        tg?.openInvoice(invoiceLink);
      } catch (error) {
        console.error("Error opening invoice:", error);
        this.setError("Failed to open invoice");
      }
    } catch (error) {
      console.error("Error generating invoice:", error);
      this.setError("Failed to generate invoice");
    } finally {
      this.setLoadingPurchase(false);
    }
  }

  // Покупка кейса за поинты (баланс пользователя)
  async purchaseCaseWithPoints(caseId: number, quantity: number = 1) {
    try {
      this.setLoadingPurchase(true);
      const result = await purchaseCaseWithPoints(caseId, quantity);
      
      // Вместо запроса на обновление списка кейсов, обновляем локальные данные
      if (result) {
        runInAction(() => {
          // 1. Обновляем баланс пользователя напрямую
          if (result.pointsLeft !== undefined) {
            const userStore = getStore().user;
            if (userStore.user) {
              userStore.user.balance = result.pointsLeft;
            }
          }
          
          // 2. Добавляем купленные кейсы в список userCases
          const now = new Date();
          const newCases = Array(quantity).fill(null).map(() => ({
            id: Date.now() + Math.floor(Math.random() * 1000), // Временный ID
            caseId: caseId,
            userId: getStore().user.user?.id,
            purchasedAt: now.toISOString(),
            case: {
              id: caseId,
              name: result.caseName,
              type: result.type
            }
          }));
          
          this.setUserCases([...newCases, ...this._userCases]);
        });
      }
      
      return result;
    } catch (error: any) {
      console.error("Error purchasing case with points:", error);
      this.setError(error?.response?.data?.message || "Failed to purchase case");
      return null;
    } finally {
      this.setLoadingPurchase(false);
    }
  }

  // Геттеры для доступа к состоянию
  get cases() {
    return this._cases;
  }

  get selectedCase() {
    return this._selectedCase;
  }

  get caseHistory() {
    return this._caseHistory;
  }

  get freeAvailability() {
    return this._freeAvailability;
  }

  get openResult() {
    return this._openResult;
  }

  get loading() {
    return this._loading;
  }

  get error() {
    return this._error;
  }

  get userCases() {
    return this._userCases;
  }

  get loadingPurchase() {
    return this._loadingPurchase;
  }

  get loadingUserCases() {
    return this._loadingUserCases;
  }
}
