import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import styles from './RaffleComponents.module.css';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

const NoActiveRaffle: React.FC = observer(() => {
  const { t } = useTranslate();
  return (
    <Card className={styles.raffleCard}>
      <CardHeader>
        <CardTitle>{t('no_active_raffles')}</CardTitle>
        <CardDescription>{t('follow_updates')}</CardDescription>
      </CardHeader>
    </Card>
  );
});

export default NoActiveRaffle;