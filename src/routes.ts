// src/routes.ts (если у вас массив роутов)
import MainPage from './pages/MainPage';
import PartnersPage from './pages/PartnersPage';
import { MAIN_ROUTE, PARTNERS_ROUTE } from './utils/consts';


export const publicRoutes = [
  { path: MAIN_ROUTE, Component: MainPage },
  { path: PARTNERS_ROUTE, Component: PartnersPage },
  // прочие публичные
];

export const privateRoutes = [
  // ...
];
