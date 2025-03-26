import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import styles from './RaffleComponents.module.css';

const NoPreviousRaffle: React.FC = () => {

    return (
        <Card className={styles.raffleCard}>
            <CardHeader>
                <CardTitle>No previous raffles</CardTitle>
                <CardDescription>Check back later!</CardDescription>
            </CardHeader>
        </Card>
    )
}

export default NoPreviousRaffle;
