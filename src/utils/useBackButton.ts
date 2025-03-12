import { useEffect } from "react";
import { TelegramWebApp } from "../types/types";

const tg = window.Telegram?.WebApp as unknown as TelegramWebApp;

/**
 * Хук для управления кнопкой "Назад" в Telegram Web App
 * 
 * @param show - Флаг отображения кнопки
 * @param callback - Опциональный обработчик нажатия на кнопку
 */


export const useBackButton = (show: boolean, callback?: () => void) => {
  useEffect(() => {
    // Проверяем, доступен ли Telegram API
    if (!tg || !tg.BackButton) return;

    // Показываем или скрываем кнопку в зависимости от параметра
    if (show) {
      tg.BackButton.show();
    } else {
      tg.BackButton.hide();
    }

    // Устанавливаем обработчик клика, если он предоставлен
    if (callback) {
      tg.BackButton.onClick(callback);
    }

    // Очистка при размонтировании
    return () => {
      if (!tg || !tg.BackButton) return;
      
      // Удаляем обработчик, если он был установлен
      if (callback) {
        tg.BackButton.offClick(callback);
      }
      
      // Скрываем кнопку при размонтировании компонента
      tg.BackButton.hide();
    };
  }, [show, callback]); // Эффект выполняется при изменении параметров show или callback
};

export default useBackButton;



