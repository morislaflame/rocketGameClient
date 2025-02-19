import { UserInfo } from '@/types/types';

export const getUserName = (user: UserInfo) => {
    return user.username || `Astronaut #${user.id}`;
}

export const getUserBalance = (user: UserInfo) => {
    return user.balance;
}




