import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const telegramAuth = async (initData: string) => {
    const { data } = await $host.post('api/user/auth/telegram', { initData });
    localStorage.setItem('token', data.token);
    return {
        ...jwtDecode(data.token),// Убедитесь, что сервер возвращает firebaseToken
    };
};

export const registration = async (email: string, password: string) => {
    const { data } = await $host.post('api/user/registration', { email, password });
    console.log("Token received during registration:", data.token);  // Логируем полученный токен
    localStorage.setItem('token', data.token);
    return {
        ...jwtDecode(data.token),
    };
};

export const login = async (email: string, password: string) => {
    const { data } = await $host.post('api/user/login', { email, password });
    localStorage.setItem('token', data.token);
    return {
        ...jwtDecode(data.token),
    };
};

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)// Логирование
    return {
        ...jwtDecode(data.token),
    };
}

export const fetchMyInfo = async () => {
    const { data } = await $authHost.get('api/user/me');
    return data;
};

export const fetchTopUsers = async () => {
    const { data } = await $host.get('api/user/top');
    return data;
};


export const getAvailableBonuses = async () => {
    const { data } = await $authHost.get('api/user/bonuses');
    return data; 
  };

  export const generateReferralCode = async () => {
    const { data } = await $authHost.post('api/referral/generate-referral-code');
    return data;
};