// src/components/UserAccount/UserHeader.tsx
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatarImg from '@/assets/avatar.svg';
import styles from './UserAccountComponents.module.css';
import { TonConnectButton, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { TonConnectWallet } from '@/types/types';

interface UserHeaderProps {
  username: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ username }) => {
  const [tonConnectUI] = useTonConnectUI();

  const wallet = useTonWallet() as TonConnectWallet | undefined;

  const isConnected = tonConnectUI.connected;

  console.log(wallet);

  return (
    <div className={styles.pageTitle}>
      <h1>{username}</h1>
      <Avatar className={styles.avatar}>
        <AvatarImage src={avatarImg} />
        
        <AvatarFallback>
          <img src={avatarImg} alt="Avatar" />
        </AvatarFallback>
      </Avatar>
        <TonConnectButton />
        {isConnected && (
          <div className={styles.walletInfo}>
            <img src={wallet?.imageUrl} alt="Wallet" className={styles.walletImage}/>
            <p className={styles.walletName}>{wallet?.name}</p>
          </div>
        )}
    </div>
  );
};

export default UserHeader;
