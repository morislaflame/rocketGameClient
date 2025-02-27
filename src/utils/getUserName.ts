import { UserInfo } from '@/types/types';

export const getUserName = (user: UserInfo | null) => {
    return user?.username || `Astronaut #${user?.id}`;
}

export const getUserBalance = (user: UserInfo | null) => {
    return user?.balance || 0;
}




