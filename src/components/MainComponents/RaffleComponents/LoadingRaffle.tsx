import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './RaffleComponents.module.css';

const LoadingRaffle: React.FC = () => {
  return (
    <Card className={styles.raffleCard}>
      <CardHeader>
        <CardTitle className={styles.loadingTitle}>Loading raffle...</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default LoadingRaffle;