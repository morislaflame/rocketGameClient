import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaQuestionCircle } from "react-icons/fa";
import styles from './RaffleComponents.module.css';
import { useTranslate } from '@/utils/useTranslate';

interface AboutRaffleProps {
  position: 'left' | 'right';
}

const AboutRaffle: React.FC<AboutRaffleProps> = ({ position }) => {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslate();

  return (
    <>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => setOpen(true)} 
        className={position === 'left' ? styles.aboutRaffleButtonLeft : styles.aboutRaffleButtonRight}
      >
        <FaQuestionCircle />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={styles.aboutRaffleDialog}>
          <DialogHeader>
            <DialogTitle>{t('about_raffle')}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className={styles.aboutRaffleContent}>
              <p>{t('raffle_description_1')}</p>
              <p>{t('raffle_description_2')}</p>
              <p>{t('raffle_description_3')}</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AboutRaffle;