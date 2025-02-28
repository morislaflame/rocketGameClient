import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StoreProvider, { Context } from "./store/StoreProvider";
import {THEME, TonConnectUIProvider} from "@tonconnect/ui-react"

export { Context };
const manifestUrl = 'https://gist.githubusercontent.com/siandreev/75f1a2ccf2f3b4e2771f6089aeb06d7f/raw/d4986344010ec7a2d1cc8a2a9baa57de37aaccb8/gistfile1.txt';

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