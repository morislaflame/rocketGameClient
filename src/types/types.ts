// src/types/types.ts

export interface UserAuthResponse {
    token: string;          // JSON Web Token
    // Если сервер возвращает ещё что-то, добавьте
    // firebaseToken?: string; // пример из прошлого, если нужно
  }
  
  export interface UserInfo {
    id: number;
    telegramId: number;
    username: string | null;
    role: string;
    balance: number;
    // и т.д. - какие поля у вас есть
  }
  