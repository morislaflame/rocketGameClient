import { $authHost } from "./index";

export const launchRocket = async () => {
    const { data } = await $authHost.post('api/game/launch');
    return data;
};



