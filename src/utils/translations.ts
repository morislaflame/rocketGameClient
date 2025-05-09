import { Task } from "@/types/types";

type TranslationType = {
    [key: string]: {
      ru: string;
      en: string;
    }
  };
  
  export const translations: TranslationType = {
    balance: {
      ru: 'Баланс',
      en: 'Balance'
    },
    tasks: {
      ru: 'Задания',
      en: 'Tasks'
    },
    tasks_subtitle: {
      ru: 'Выполняй задания и получай призы',
      en: 'Complete tasks and get rewards'
    },
    daily: {
      ru: 'Ежедневные',
      en: 'Daily'
    },
    one_time: {
      ru: 'Одноразовые',
      en: 'One-Time'
    },
    special: {
      ru: 'Специальные',
      en: 'Special'
    },
    task_completed: {
      ru: 'Задание выполнено',
      en: 'Task completed'
    },
    task_completed_error: {
      ru: 'Ошибка при выполнении задания',
      en: 'Error completing task'
    },


    winning_gifts: {
      ru: 'Выигранные призы',
      en: 'Winning gifts'
    },
    all_gifts: {
        ru: 'Все подарки, которые вы выиграли',
        en: 'All the gifts you have won'
    },
    you_dont_have_any_winning_gifts: {
        ru: 'У вас пока нет выигранных подарков. Участвуйте в розыгрышах, чтобы выиграть',
        en: 'You don\'t have any winning gifts yet. Participate in the raffles to win'
    },
    sell_for_tokens: {
        ru: 'Продать\nза токены',
        en: 'Sell for tokens'
    },
    get_gift: {
        ru: 'Получить',
        en: 'Get gift'
    },
    affiliate: {
      ru: 'Реферальная программа',
      en: 'Affiliate Program'
    },
    invite_friends: {
        ru: 'Пригласите друзей и получите награду',
        en: 'Invite friends and get a reward'
    },
    receiving_a_gift: {
        ru: 'Получение подарка',
        en: 'Receiving a gift'
    },
    once_confirmed_you_will_be_contacted_within_a_couple_hours_to_issue_the_gift: {
        ru: 'После подтверждения с вами свяжутся в течение нескольких часов для выдачи подарка',
        en: 'Once confirmed, you will be contacted within a couple hours to issue the gift'
    },
    send_request: {
        ru: 'Отправить запрос',
        en: 'Send request'
    },
    selling_a_gift: {
        ru: 'Продажа подарка',
        en: 'Selling a gift'
    },
    you_are_about_to_sell_the_gift_and_receive_tokens: {
        ru: 'Вы собираетесь продать подарок и получить токены',
        en: 'You are about to sell the gift and receive tokens'
    },
    you_will_receive: {
        ru: 'Вы получите',
        en: 'You will receive'
    },
    tokens: {
        ru: 'токенов',
        en: 'tokens'
    },
    sell_gift: {
        ru: 'Продать подарок',
        en: 'Sell gift'
    },

    claim_your_daily_reward: {
        ru: 'Заберите свою ежедневную награду',
        en: 'Claim your daily reward'
    },
    check_out_the_app_every_day_and_pick_up_even_more_rewards: {
        ru: 'Проверяйте приложение каждый день и забирайте ещё больше наград!',
        en: 'Check out the app every day and pick up even more rewards!'
    },
    claim: {
        ru: 'Забрать',
        en: 'Claim'
    },
    tap_to_launch: {
        ru: 'Нажмите, чтобы запустить',
        en: 'Tap to launch'
    },
    launches: {
        ru: 'запусков',
        en: 'launches'
    },
    products_not_found: {
        ru: 'Товары не найдены',
        en: 'Products not found'
    },
    more: {
        ru: 'Ещё',
        en: 'More'
    },
    shop: {
        ru: 'Магазин',
        en: 'Shop'
    },
    buy_additional_rocket_launches: {
        ru: 'Купить дополнительные запуски ракеты',
        en: 'Buy additional rocket launches'
    },

    leaderboard: {
        ru: 'Таблица лидеров',
        en: 'Leaderboard'
    },
    view_your_position_on_the_leaderboard: {
        ru: 'Посмотреть свою позицию в таблице лидеров',
        en: 'View your position on the leaderboard'
    },
    the_most_active_users_will_receive_more_rewards: {
        ru: 'Самые активные пользователи получат больше наград',
        en: 'The most active users will receive more rewards'
    },
    rewards_on: {
        ru: 'Награды',
        en: 'Rewards on'
    },
    prize_pool: {
        ru: 'Призовой фонд',
        en: 'Prize pool'
    },

    not_available: {
        ru: 'Не доступен',
        en: 'Not available'
    },
    open_case: {
        ru: 'Открыть кейс',
        en: 'Open case'
    },
    you_have: {
        ru: 'У вас',
        en: 'You have'
    },
    spinning: {
        ru: 'Крутится...',
        en: 'Spinning...'
    },
    spin: {
        ru: 'Крутить',
        en: 'Spin'
    },
    failed_to_open_case: {
        ru: 'Не удалось открыть кейс',
        en: 'Failed to open case'
    },
    free_case_will_be_available_in: {
        ru: 'Бесплатный кейс будет доступен через',
        en: 'Free case will be available in'
    },
    you_need_to_purchase_this_case_first: {
        ru: 'Вы должны сначала приобрести этот кейс',
        en: 'You need to purchase this case first'
    },
    congratulations: {
        ru: 'Поздравляем!',
        en: 'Congratulations!'
    },
    you_have_won: {
        ru: 'Вы выиграли',
        en: 'You have won'
    },
    rocket_launches: {
        ru: 'Запуски ракеты',
        en: 'Rocket launches'
    },
    gift: {
        ru: 'Подарок',
        en: 'Gift'
    },
    loading_raffle_data: {
        ru: 'Загрузка данных розыгрыша...',
        en: 'Loading raffle data...'
    },
    no_active_raffles: {
        ru: 'Нет активных розыгрышей',
        en: 'No active raffles'
    },
    follow_updates: {
        ru: 'Следите за обновлениями!',
        en: 'Follow updates!'
    },
    no_previous_raffles: {
        ru: 'Нет предыдущих розыгрышей',
        en: 'No previous raffles'
    },
    check_back_later: {
        ru: 'Проверьте позже!',
        en: 'Check back later!'
    },
    ends_in: {
        ru: 'Заканчивается через',
        en: 'Ends in'
    },
    raffle: {
        ru: 'Розыгрыш',
        en: 'Raffle'
    },
    tickets_to_start_the_raffle: {
        ru: 'Билетов для начала розыгрыша',
        en: 'Tickets to start the raffle'
    },
    end: {
        ru: 'Закончился',
        en: 'Ended'
    },
    you_ll_soon_recognize_the_gift: {
        ru: 'Скоро подарок будет определён',
        en: 'You\'ll soon recognize the gift'
    },
    see_the_result: {
        ru: 'Посмотреть результат',
        en: 'See the result'
    },
    winner: {
        ru: 'Победитель',
        en: 'Winner'
    },
    total_participants: {
        ru: 'Всего участников',
        en: 'Total participants'
    },
    winner_chance: {
        ru: 'Шанс победителя',
        en: 'Winner chance'
    },
    winning_ticket: {
        ru: 'Выигравший билет',
        en: 'Winning ticket'
    },
    total_tickets: {
        ru: 'Всего билетов',
        en: 'Total tickets'
    },
    raffle_history_is_empty: {
        ru: 'История розыгрышей пуста',
        en: 'Raffle history is empty'
    },
    loading: {
        ru: 'Загрузка...',
        en: 'Loading...'
    },
    load_more: {
        ru: 'Загрузить больше',
        en: 'Load more'
    },
    
    buy_tickets: {
        ru: 'Купить билеты',
        en: 'Buy tickets'
    },
    raffle_tickets: {
        ru: 'Билеты розыгрыша',
        en: 'Raffle Tickets'
    },
    buy_tickets_subtitle: {
        ru: 'Купите билеты для участия в розыгрыше',
        en: 'Buy tickets to participate in the raffle'
    },
    no_tickets_found: {
        ru: 'Билетов не найдено',
        en: 'No tickets found'
    },
    transaction_in_process: {
        ru: 'Транзакция в процессе... Пожалуйста, подождите.',
        en: 'Transaction in process... Please wait.'
    },
    transaction_not_completed: {
        ru: 'Транзакция не завершена',
        en: 'Transaction not completed'
    },
    transaction_completed_successfully: {
        ru: 'Транзакция завершена успешно!',
        en: 'Transaction completed successfully!'
    },
    close: {
        ru: 'Закрыть',
        en: 'Close'
    },
    loading_tickets_information: {
        ru: 'Загрузка информации о билетах...',
        en: 'Loading tickets information...'
    },
    your_tickets: {
        ru: 'Ваши билеты',
        en: 'Your tickets'
    },
    your_chance_to_win: {
        ru: 'Ваш шанс выиграть',
        en: 'Your chance to win'
    },
    of: {
        ru: 'из',
        en: 'of'
    },
    buy_tickets_to_participate_in_the_raffle: {
        ru: 'Купите билеты для участия в розыгрыше',
        en: 'Buy tickets to participate in the raffle'
    },
    you_dont_have_tickets_yet: {
        ru: 'У вас пока нет билетов',
        en: 'You don\'t have tickets yet'
    },
    tickets_for_raffle: {
        ru: 'Билеты для розыгрыша',
        en: 'Tickets for raffle'
    },
    all_ticket_numbers_you_purchased_for_this_raffle: {
        ru: 'Все билеты, которые вы приобрели для этого розыгрыша',
        en: 'All ticket numbers you purchased for this raffle'
    },
    loading_tickets: {
        ru: 'Загрузка билетов...',
        en: 'Loading tickets...'
    },
    raffle_history: {
        ru: 'История розыгрышей',
        en: 'Raffle history'
    },
    list_of_all_past_raffles_and_winners: {
        ru: 'Список всех прошедших розыгрышей и победителей',
        en: 'List of all past raffles and winners'
    },
    see_all_past_raffles_and_winners: {
        ru: 'Посмотреть все прошедшие розыгрыши и победителей',
        en: 'See all past raffles and winners'
    },
    very_soon: {
        ru: 'Очень скоро...',
        en: 'Very soon...'
    },
    check_for_updates_in_our: {
        ru: 'Следите за обновлениями в нашем',
        en: 'Follow updates in our'
    },
  };
  
  export const translate = (key: string, language: 'ru' | 'en'): string => {
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translations[key][language];
  };



type TaskTranslations = {
  [key: string]: {
    ru: string;
    en: string;
  };
};

// Переводы для различных кодов заданий
export const taskTranslations: TaskTranslations = {
  // Участие в розыгрыше
  RAFFLE_PART: {
    ru: "Участвуйте в текущем розыгрыше",
    en: "Participate in current raffle"
  },
  
  // Подписки на телеграм-каналы
  TELEGRAM_SUB: {
    ru: "Присоединиться к каналу",
    en: "Join channel"
  },
  
  // Шаринг истории
  STORY_SHARE: {
    ru: "Поделиться историей в Telegram",
    en: "Share story on Telegram"
  },
  
  // Реферальная программа
  REFERRAL_BONUS: {
    ru: "Получайте награду за каждого приглашенного друга",
    en: "Get a reward for every referred friend"
  }
};

// Функция для получения локализованного текста задания
export const getTaskText = (task: Task, language: 'ru' | 'en'): string => {
  const { code, metadata, description } = task;
  
  // Если нет кода, возвращаем оригинальное описание
  if (!code || !taskTranslations[code]) {
    return description;
  }
  
  // Базовый текст из словаря переводов
  let text = taskTranslations[code][language];
  
  // Специальная обработка для разных типов заданий
  if (code === 'TELEGRAM_SUB' && metadata?.channelUsername) {
    // Удаляем @ из имени канала, если он присутствует
    const channelName = metadata.channelUsername.replace(/^@/, '');
    
    // Формируем текст с именем канала
    return language === 'ru' 
      ? `Присоединиться к каналу @${channelName}` 
      : `Join @${channelName} channel`;
  }
  
  return text;
};