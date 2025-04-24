import { Button } from '@/components/ui/button';
import React from 'react';

interface RouletteButtonProps {
  onStart: () => void;
  disabled?: boolean;
}

const RouletteButton: React.FC<RouletteButtonProps> = ({ onStart, disabled = false }) => {
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
            Spin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RouletteButton; 