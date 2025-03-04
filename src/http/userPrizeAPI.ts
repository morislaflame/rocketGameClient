import { $authHost } from './index';

// Получение всех призов пользователя
export const getUserPrizes = async () => {
  const { data } = await $authHost.get('api/user-prize/my');
  return data;
};

// Продажа приза
export const sellPrize = async (prizeId: number) => {
  const { data } = await $authHost.post(`api/user-prize/sell/${prizeId}`);
  return data;
};

// Запрос на физическое получение приза
export const receivePrize = async (prizeId: number) => {
  const { data } = await $authHost.post(`api/user-prize/receive/${prizeId}`);
  return data;
};