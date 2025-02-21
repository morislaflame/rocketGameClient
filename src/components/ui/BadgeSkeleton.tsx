import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import styles from './MainUi.module.css';

const BadgeSkeleton: React.FC = () => {
  return (
    <div className={styles.balanceBadge}>
      <Skeleton className="w-full h-full" style={{ backgroundColor: 'color-mix(in oklab, hsl(0deg 10.85% 89.22%) 10%, transparent)' }}/>
    </div>
  );
};

export default BadgeSkeleton;