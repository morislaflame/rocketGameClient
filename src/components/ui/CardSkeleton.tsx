import React, { memo } from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';


const CardSkeleton: React.FC = memo(() => {
  return (
    <Card className="w-full h-[100px] p-6 bg-[#111111] border-none">
      <CardHeader className="p-0 flex flex-row items-center h-full gap-4">
        <Skeleton className="rounded-full w-10 h-10 m-0" style={{ backgroundColor: 'color-mix(in oklab, hsl(0deg 10.85% 89.22%) 10%, transparent)' }} />
        <div className="flex flex-col gap-2 w-full h-full">
          <Skeleton className="h-20 w-full" style={{ backgroundColor: 'color-mix(in oklab, hsl(0deg 10.85% 89.22%) 10%, transparent)' }} />
          <Skeleton className="h-10 w-full" style={{ backgroundColor: 'color-mix(in oklab, hsl(0deg 10.85% 89.22%) 10%, transparent)' }} />
        </div>
      </CardHeader>
    </Card>
  );
});

export default CardSkeleton;
