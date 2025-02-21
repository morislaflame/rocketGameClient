// src/components/MyAnimation.tsx
import React from 'react';
import Lottie from 'lottie-react';
import animationData from '@/assets/Animation.json';
import { Skeleton } from '@/components/ui/skeleton';

const MyAnimation: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 300, height: 300, backgroundColor: '#111111', borderRadius: '11px' }}>
        <Lottie animationData={animationData} loop={true} />
        </div>
        <div style={{ width: 150, height: 64, backgroundColor: '#111111', borderRadius: '30px', position: 'absolute', bottom: 20 }}>
            <Skeleton className="w-full h-full " style={{ backgroundColor: 'color-mix(in oklab, hsl(0deg 10.85% 89.22%) 10%, transparent)', borderRadius: '30px' }}/>
        </div>
    </div>
  );
};

export default MyAnimation;
