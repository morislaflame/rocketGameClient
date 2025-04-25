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
