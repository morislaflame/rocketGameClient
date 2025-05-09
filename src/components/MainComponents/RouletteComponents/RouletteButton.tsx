import { Button } from '@/components/ui/button';
import React from 'react';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface RouletteButtonProps {
  onStart: () => void;
  disabled?: boolean;
}

const RouletteButton: React.FC<RouletteButtonProps> = observer(({ onStart, disabled = false }) => {
  const { t } = useTranslate();
  return (
    <div className="roulette-actions">
      <div className="gray-block">
        <div className="button-wrapper">
          <Button
            onClick={onStart} 
            className="spin-button" 
            type="button"
            disabled={disabled}
          >
            {disabled ? t('spinning') : t('spin')}
          </Button>
        </div>
      </div>
    </div>
  );
});

export default RouletteButton; 