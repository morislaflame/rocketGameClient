import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslate } from "@/utils/useTranslate";
import { observer } from 'mobx-react-lite';
import { getPlanetImg } from '@/utils/getPlanetImg';
import AboutCases from './AboutCases';

interface CasesHeaderProps {
  loading: boolean;
  balance: number;
}

const CasesHeader: React.FC<CasesHeaderProps> = observer(({ loading, balance }) => {
  const { t } = useTranslate();
  
  const planetImg = getPlanetImg();
  
  return (
    <div className='flex flex-col items-center gap-2 w-full h-full overflow-hidden relative'>
      <AboutCases />
      
      <h2 className="text-3xl font-semibold leading-none tracking-tight">
        {t('lootboxes')}
      </h2>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {t('win_and_take')}
      </div>
      
      {/* Отображение баланса с учетом загрузки */}
      <div className="flex items-center justify-center gap-2 bg-black/30 px-6 rounded-full">
        {loading ? (
          <Skeleton className="w-24 h-6" />
        ) : (
          <>
            <img src={planetImg} alt="Planet" className="w-6 h-6" />
            <span className="font-medium text-lg">{balance}</span>
          </>
        )}
      </div>
    </div>
  );
});

export default CasesHeader;