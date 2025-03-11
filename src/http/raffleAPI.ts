import { $authHost } from "./index";

export const getRaffleTicketPackages = async () => {
    const { data } = await $authHost.get('api/raffle/package/all');
    return data;
};

export const getCurrentRaffle = async () => {
    const { data } = await $authHost.get('api/raffle/current');
    return data;
};

export const getPreviousRaffle = async () => {
    const { data } = await $authHost.get('api/raffle/previous');
    return data;
};

export const getUserTickets = async () => {
    const { data } = await $authHost.get('api/raffle/my-tickets');
    return data;
};

export const getRaffleHistory = async (limit: number, offset: number) => {
    const { data } = await $authHost.get('api/raffle/history', {
      params: { limit, offset },
    });
    return data;
  };

export const initTicketPurchase = async ( 
    userId: number, 
    packageId: number, 
    rawPayload: string,
    uniqueId: string,
    bonusId?: number
) => {  
    const { data } = await $authHost.post('api/raffle/purchase/init', {
        userId,
        packageId,
        rawPayload,
        uniqueId,
        bonusId
    });
    return data;
};

export const getTransactionStatus = async (userId: number, uniqueId: string) => {
    const { data } = await $authHost.get('api/raffle/purchase/status', {
        params: { userId, uniqueId }
    });
    return data;
};

export const getRaffleById = async (id: string | number) => {
    const { data } = await $authHost.get(`api/raffle/${id}`);
    return data;
};
