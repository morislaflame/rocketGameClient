import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StoreProvider, { Context } from "./store/StoreProvider";
import {THEME, TonConnectUIProvider} from "@tonconnect/ui-react"

export { Context };
const manifestUrl = 'https://gist.githubusercontent.com/morislaflame/7899ba7c1781a8dcb39f5c62548ffe1b/raw/c75c5ede411d64876cae669c0237c30664aa5905/gistfile1.txt';

// Избегаем повторного создания root при горячей перезагрузке
const rootElement = document.getElementById("root") as HTMLElement;

// Используем переменную window для хранения root между перезагрузками
declare global {
  interface Window {
    __REACT_ROOT__?: ReactDOM.Root;
  }
}

if (!window.__REACT_ROOT__) {
  window.__REACT_ROOT__ = ReactDOM.createRoot(rootElement);
}

window.__REACT_ROOT__.render(
  <TonConnectUIProvider 
    manifestUrl={manifestUrl} 
    uiPreferences={{
      theme: THEME.DARK,
      
    }}
    actionsConfiguration={{
      twaReturnUrl: 'https://t.me/drusik_test_bot'
    }}
  >
    <StoreProvider>
      <App />
    </StoreProvider>
  </TonConnectUIProvider>
);