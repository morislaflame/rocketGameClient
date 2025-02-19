import React from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '@/main'
import styles from './UserAccount.module.css'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import avatarImg from '../../assets/avatar.svg'
import { IoCard } from "react-icons/io5";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  

const UserAccount: React.FC = observer(() => {
  const { user } = React.useContext(Context)

  const getUserName = () => {
    if (user?.user?.username) {
      return user.user.username;
    } else {
      return "Astronaut #" + user.user.id;
    }
  }

  return (
        <div className={styles.pageContent}>
            <div className={styles.pageTitle}>
                <h1>{getUserName()}</h1>
                <Avatar className={styles.avatar}>
                    <AvatarImage src={avatarImg} />
                    <AvatarFallback>
                        <img src={avatarImg} alt="Avatar" />
                    </AvatarFallback>
                </Avatar>
                <h3 style={{color: "#358FF2", fontSize: "15px", fontWeight: "400", display: "flex", alignItems: "center", gap: "4px"}}> <IoCard />Connect your wallet</h3>
            </div>
            <div className={styles.cardContainer}>
                <Card className={styles.card}>
                    <CardHeader className={styles.cardHeader}>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>Card Description</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
  )
})

export default UserAccount