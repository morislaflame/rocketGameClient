import React, { memo } from 'react';
import Lottie from 'lottie-react';
import { Skeleton } from '@/components/ui/skeleton';

// Можете использовать любую свою анимацию в JSON-формате
import giftAnimation from '@/assets/Gift.json'; 

const LoadingRaffle: React.FC = memo(() => {
  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        // justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div className="flex flex-col items-center justify-center rounded-lg w-full h-[80px] relative">
        <Skeleton className="w-full h-full absolute" />
          <p style={{ color: '#aaa' }}>
            Loading raffle data...
          </p>
      </div>
      {/* Контейнер с анимацией и скелетоном поверх */}
      <div 
        style={{ 
          width: '150px', 
          height: '150px', 
          position: 'relative', 
          borderRadius: '30px',
        }}
      >
        {/* Скелетон: полупрозрачная плашка поверх (можно стилизовать как хотите) */}
        <Skeleton 
          className="w-full h-full" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            borderRadius: '30px' 
          }}
        />
        {/* Сама Lottie-анимация */}
        <Lottie 
          animationData={giftAnimation} 
          loop={true} 
          style={{ borderRadius: '30px' }}
        />
      </div>
      <div className='flex flex-col items-center gap-2 w-[100px] h-[20px]'>
        <Skeleton className='w-full h-full' />
      </div>
      <div className="flex flex-col items-center justify-center gap-2 w-full h-[100px] mt-2 relative">
        <Skeleton className="w-full h-full absolute" />
      </div>
      <div className='flex flex-col items-center gap-2 w-full h-[200px]'>
        <Skeleton className='w-full h-full' />
      </div>
    </div>
  );
});

export default LoadingRaffle;
