/// <reference types="vite/client" />

interface TelegramWebApp {
    initData: string;
    WebApp?: {
      initData: string;
      HapticFeedback?: {
        impactOccurred: (style: string) => void;
      };
      openInvoice: (url: string, callback: (status: string) => void) => void;
    };
  }
  
  interface Window {
    Telegram?: TelegramWebApp;
    __REACT_ROOT__?: ReactDOM.Root;
  }