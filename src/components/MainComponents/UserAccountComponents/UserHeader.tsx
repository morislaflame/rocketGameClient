// src/components/UserAccount/UserHeader.tsx
import React, { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import styles from './UserAccountComponents.module.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { Context } from '@/store/StoreProvider';
import { IStoreContext } from '@/store/StoreProvider';
import { getUserName } from '@/utils/getUserName';
import { getPlanetImg } from "@/utils/getPlanetImg";
import avatarImg from '@/assets/AVATAR.png';
import { Skeleton } from '@/components/ui/skeleton';

const UserHeader: React.FC = () => {
  const { user } = React.useContext(Context) as IStoreContext;
  const [loading, setLoading] = React.useState(true);
  const dataFetchedRef = useRef(false);
  
  useEffect(() => {
    if (!dataFetchedRef.current) {
      const fetchData = async () => {
        setLoading(true);
        await user.fetchMyInfo();
        setLoading(false);
        dataFetchedRef.current = true;
      };
      
      fetchData();
    }
  }, [user]);

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
      {loading ? (
        <div className="flex justify-center items-center h-[120px] w-[120px] rounded-[36px]">
          <Skeleton className="w-full h-full" />
        </div>
      ) : (
        <>
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
          </Avatar>
          <TonConnectButton />
        </>
      )}
    </div>
  );
};

export default UserHeader;
