import { makeAutoObservable, runInAction } from "mobx";
import { 
  fetchCases, 
  fetchOneCase, 
  openCase, 
  checkFreeCaseAvailability, 
  fetchUserCaseHistory 
} from "../http/casesAPI";
import { Case, CaseHistory, CaseOpenResult, FreeCaseAvailability } from "@/types/types";

export default class CasesStore {
  _cases: Case[] = [];
  _selectedCase: Case | null = null;
  _caseHistory: CaseHistory | null = null;
  _freeAvailability: { [key: number]: FreeCaseAvailability } = {};
  _openResult: CaseOpenResult | null = null;
  _loading = false;
  _error = "";

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
}
