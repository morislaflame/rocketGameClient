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
import { useTranslate } from '@/utils/useTranslate';

const AboutCases: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslate();

  return (
    <>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => setOpen(true)} 
        className="absolute right-2 top-2"
      >
        <FaQuestionCircle />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[85vw] rounded-lg">
          <DialogHeader>
            <DialogTitle>{t('about_lootboxes')}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex flex-col gap-3 mt-2">
              <p>{t('lootboxes_description_1')}</p>
              <p>{t('lootboxes_description_2')}</p>
              <p>{t('lootboxes_description_3')}</p>
              <p>{t('lootboxes_description_4')}</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AboutCases;