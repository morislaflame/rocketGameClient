// src/components/UserAccount/UserHeader.tsx
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatarImg from '@/assets/avatar.svg';
import { IoCard } from "react-icons/io5";
import styles from './UserAccountComponents.module.css';

interface UserHeaderProps {
  username: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ username }) => {
  return (
    <div className={styles.pageTitle}>
      <h1>{username}</h1>
      <Avatar className={styles.avatar}>
        <AvatarImage src={avatarImg} />
        <AvatarFallback>
          <img src={avatarImg} alt="Avatar" />
        </AvatarFallback>
      </Avatar>
      <h3
        style={{
          color: "#358FF2",
          fontSize: "15px",
          fontWeight: "400",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <IoCard /> Connect your wallet
      </h3>
    </div>
  );
};

export default UserHeader;
