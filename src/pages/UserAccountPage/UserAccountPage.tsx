import { observer } from 'mobx-react-lite'
import React from 'react'
import UserAccount from '@/components/MainComponents/UserAccount'

const UserAccountPage: React.FC = observer(() => {
  return (
    <UserAccount />
  )
})

export default UserAccountPage  