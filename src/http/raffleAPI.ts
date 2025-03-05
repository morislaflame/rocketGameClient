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

export const getRaffleHistory = async () => {
    const { data } = await $authHost.get('api/raffle/history');
    return data;
};

export const confirmTicketPurchase = async (
    userId: number, 
    packageId: number, 
    transactionBoc: string,
    payloadData?: string // Изменили тип с BOC на простую строку
) => {
    const { data } = await $authHost.post('api/raffle/purchase', {
        userId,
        packageId, 
        transactionBoc,
        payloadData // Изменили название параметра для ясности
    });
    return data;
};

export const initTicketPurchase = async ( 
    userId: number, 
    packageId: number, 
    rawPayload: string,
    uniqueId: string
) => {  
    const { data } = await $authHost.post('api/raffle/purchase/init', {
        userId,
        packageId,
        rawPayload,
        uniqueId
    });
    return data;
};

export const getTransactionStatus = async (userId: number, uniqueId: string) => {
    const { data } = await $authHost.get('api/raffle/purchase/status', {
        params: { userId, uniqueId }
    });
    return data;
};
