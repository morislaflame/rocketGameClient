// src/components/UserAccount/UserHeader.tsx
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import styles from './UserAccountComponents.module.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { Context } from '@/store/StoreProvider';
import { IStoreContext } from '@/store/StoreProvider';
import { getUserName } from '@/utils/getUserName';
import { getPlanetImg } from "@/utils/getPlanetImg";
import avatarImg from '@/assets/ACC_SOLID.svg';

const UserHeader: React.FC = () => {
  const { user } = React.useContext(Context) as IStoreContext;

  const balance = user?.user?.balance ?? 0;
  const planetImg = getPlanetImg();
  const avatarUrl = user?.user?.imageUrl;

  const getAvatarFallback = () => {
    if (user?.user?.username) {
      return user.user.username.substring(0, 2).toUpperCase();
    } else if (user?.user?.id) {
      return user.user.id.toString();
    }
    return "US"; // Дефолтное значение, если ничего нет
  };

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
        <AvatarImage src={avatarUrl || avatarImg} alt="User avatar" />
        
        <AvatarFallback>
          {getAvatarFallback()}
        </AvatarFallback>
        <ProgressiveBlur
        className='pointer-events-none absolute bottom-0 left-0 h-[50%] w-full'
        blurIntensity={1}
      />
      </Avatar>
        <TonConnectButton />
        
    </div>
  );
};

export default UserHeader;
