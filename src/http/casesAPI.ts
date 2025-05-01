import { $authHost } from "./index";

// Получение всех кейсов
export const fetchCases = async (params = {}) => {
  const { data } = await $authHost.get("api/case", { params });
  return data;
};

// Получение конкретного кейса по ID
export const fetchOneCase = async (id: number) => {
  const { data } = await $authHost.get(`api/case/${id}`);
  return data;
};

// Открытие кейса
export const openCase = async (caseId: number) => {
  const { data } = await $authHost.post(`api/case/${caseId}/open`);
  return data;
};

// Проверка доступности бесплатного кейса
export const checkFreeCaseAvailability = async (caseId: number) => {
  const { data } = await $authHost.get(`api/case/${caseId}/availability`);
  return data;
};

// Получение истории открытия кейсов пользователем
export const fetchUserCaseHistory = async (params = {}) => {
  const { data } = await $authHost.get("api/case/user/history", { params });
  return data;
};

// Инициализация покупки кейса за TON
export const initCasePurchaseTON = async (
  userId: number,
  caseId: number,
  rawPayload: string, 
  uniqueId: string,
  quantity: number = 1
) => {
  const { data } = await $authHost.post("api/case/purchase/ton/init", {
    userId,
    caseId,
    rawPayload,
    uniqueId,
    quantity
  });
  return data;
};

// Получение статуса транзакции
export const getCaseTransactionStatus = async (userId: number, uniqueId: string) => {
  const { data } = await $authHost.get("api/case/purchase/ton/status", {
    params: { userId, uniqueId }
  });
  return data;
};

// Отмена транзакции
export const cancelCaseTransaction = async (userId: number, uniqueId: string, errorType: string) => {
  const { data } = await $authHost.post("api/case/purchase/ton/cancel", {
    userId,
    uniqueId,
    errorType
  });
  return data;
};

// Получение купленных кейсов
export const fetchUserCases = async (params = {}) => {
  const { data } = await $authHost.get("api/case/user/cases", { params });
  return data;
};

// Генерация счета для оплаты за звёзды (Telegram)
export const generateCaseInvoice = async (caseId: number, quantity: number = 1) => {
  const { data } = await $authHost.post(`api/case/${caseId}/purchase/generate-invoice`, { quantity });
  return data.invoiceLink as string;
};

// Покупка кейса за поинты (баланс пользователя)
export const purchaseCaseWithPoints = async (caseId: number, quantity: number = 1) => {
  const { data } = await $authHost.post(`api/case/${caseId}/purchase/points`, { quantity });
  return data;
};
