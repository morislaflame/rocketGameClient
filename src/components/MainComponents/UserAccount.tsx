import React from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '@/main'
import styles from './mainComponents.module.css'
const UserAccount: React.FC = observer(() => {
  const { user } = React.useContext(Context)
  return (
    <div className='pageWrapper'>
        <div className={styles.pageContent}>
            <div className={styles.pageTitle}>
                <h1>User Account</h1>
            </div>
        </div>
    </div>
  )
})

export default UserAccount