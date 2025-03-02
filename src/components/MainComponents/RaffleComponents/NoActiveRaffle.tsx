import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import styles from './RaffleComponents.module.css';

const NoActiveRaffle: React.FC = () => {
  return (
    <Card className={styles.raffleCard}>
      <CardHeader>
        <CardTitle>No active raffles</CardTitle>
        <CardDescription>Follow updates!</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default NoActiveRaffle;