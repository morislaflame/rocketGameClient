// src/components/UserAccount/UserHeader.tsx
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatarImg from '@/assets/avatar.svg';
import styles from './UserAccountComponents.module.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { Context } from '@/store/StoreProvider';
import { IStoreContext } from '@/store/StoreProvider';
import { getUserName } from '@/utils/getUserName';
import { getPlanetImg } from "@/utils/getPlanetImg";
import { Link } from 'react-router-dom';
import { PARTNERS_ROUTE } from '@/utils/consts';


const UserHeader: React.FC = () => {
  const { user } = React.useContext(Context) as IStoreContext;


  const balance = user?.user?.balance ?? 0;
  const planetImg = getPlanetImg();

  return (
    <div className={styles.pageTitle}>
      <div className={styles.balanceContainer}>
        <h1 className='text-3xl font-semibold leading-none tracking-tight'>{getUserName(user?.user)}</h1>
        <div className={styles.balanceBadge}>
          <img src={planetImg} alt="Planet" className={styles.balanceImg} />
          <p>{balance}</p>
        </div>
      </div>
      <Avatar className={styles.avatar}>
        <AvatarImage src={avatarImg} />
        
        <AvatarFallback>
          <img src={avatarImg} alt="Avatar" />
        </AvatarFallback>
        <ProgressiveBlur
        className='pointer-events-none absolute bottom-0 left-0 h-[50%] w-full'
        blurIntensity={1}
      />
      </Avatar>
        <TonConnectButton />
        <div className={styles.partnersContainer}>
          <Link to={PARTNERS_ROUTE} className={styles.partnersLink}>Партнеры</Link>
        </div>
    </div>
  );
};

export default UserHeader;
