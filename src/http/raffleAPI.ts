import { $authHost } from "./index";

export const getRaffleTicketPackages = async () => {
    const { data } = await $authHost.get('api/raffle/package/all');
    return data;
};

export const getCurrentRaffle = async () => {
    const { data } = await $authHost.get('api/raffle/current');
    return data;
};

export const getRaffleHistory = async () => {
    const { data } = await $authHost.get('api/raffle/history');
    return data;
};

export const confirmTicketPurchase = async (userId: number, packageId: number, transactionHash: string) => {
    const { data } = await $authHost.post('api/raffle/purchase', {
        userId,
        packageId, 
        transactionHash
    });
    return data;
};

