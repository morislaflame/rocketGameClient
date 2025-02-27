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



