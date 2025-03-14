import { TelegramWebApp } from "@/types/types";

// Получаем доступ к объекту Telegram
const tg = window.Telegram?.WebApp as unknown as TelegramWebApp;

// Функция форматирования с использованием openTelegramLink
export const renderFormattedDescription = (description: string) => {
  // Регулярное выражение для поиска @username в тексте
  const regex = /(@\S+)/g;
  const parts = description.split(regex);
  
  return parts.map((part, index) => {
    // Если часть соответствует формату @username
    if (part.match(/^@\S+$/)) {
      const username = part.substring(1);
      const telegramUrl = `https://t.me/${username}`;
      
      // Создаем кликабельный спан, который вызывает openTelegramLink
      return (
        <span 
          key={index}
          style={{ color: "#FFFFFF", textDecoration: "underline", cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation(); // Предотвращаем всплытие события
            if (tg && typeof tg.openTelegramLink === 'function') {
              tg.openTelegramLink(telegramUrl);
            } else {
              // Запасной вариант, если метод недоступен
              window.open(telegramUrl, '_blank');
            }
          }}
        >
          {part}
        </span>
      );
    }
    // Обычный текст возвращаем как есть
    return part;
  });
};