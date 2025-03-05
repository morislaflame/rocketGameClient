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
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      {/* Контейнер с анимацией и скелетоном поверх */}
      <div 
        style={{ 
          width: '100%', 
          height: '100%', 
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

      <p style={{ marginTop: 16, color: '#aaa' }}>
        Loading raffle data...
      </p>
    </div>
  );
});

export default LoadingRaffle;
