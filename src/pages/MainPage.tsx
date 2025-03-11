import React, { lazy } from 'react';
import { observer } from 'mobx-react-lite';


const Raffle = lazy(() => import('@/components/MainComponents/Raffle'));


const MainPage: React.FC = observer(() => {

  return (
    <Raffle />
  );
});

export default MainPage;
