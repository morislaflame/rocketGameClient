// src/routes.ts (если у вас массив роутов)
import MainPage from './pages/MainPage';
import PartnersPage from './pages/PartnersPage';
import UserAccountPage from './pages/UserAccountPage/UserAccountPage';
import RocketPage from './pages/RocketPage/RocketPage';
import CasesPage from './pages/CasesPage/CasesPage';
import RoulettePage from './pages/RoulettePage/RoulettePage';
import { MAIN_ROUTE, PARTNERS_ROUTE, USER_ACCOUNT_ROUTE, ROCKET_ROUTE, CASES_ROUTE, ROULETTE_ROUTE, ROULETTE_CASE_ROUTE } from './utils/consts';


export const publicRoutes = [
  { path: MAIN_ROUTE, Component: MainPage },
  { path: PARTNERS_ROUTE, Component: PartnersPage },
  { path: USER_ACCOUNT_ROUTE, Component: UserAccountPage },
  { path: ROCKET_ROUTE, Component: RocketPage },
  { path: CASES_ROUTE, Component: CasesPage },
  { path: ROULETTE_ROUTE, Component: RoulettePage },
  { path: ROULETTE_CASE_ROUTE, Component: RoulettePage },
];

export const privateRoutes = [
  // ...
];
