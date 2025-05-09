import React, { useRef, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GoAlertFill } from "react-icons/go";
import gsap from "gsap";
import styles from './FunctionalComponents.module.css';
import { useTranslate } from "@/utils/useTranslate";
import { observer } from "mobx-react-lite";

interface SoonAlertProps {
  showAlert: boolean;
  onClose: () => void;
}

const SoonAlert: React.FC<SoonAlertProps> = observer(({ showAlert, onClose }) => {
  const alertRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslate();

  useEffect(() => {
    if (showAlert && alertRef.current) {
      gsap.fromTo(
        alertRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    }
  }, [showAlert]);

  const handleCloseAlert = () => {
    if (alertRef.current) {
      gsap.to(alertRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  return (
    showAlert && (
      <Alert className={styles.alert} variant="default" ref={alertRef}>
        <GoAlertFill size={24} />
        <div className={styles.alertContent}>
          <div className={styles.alertContentText}>
            <AlertTitle>{t('very_soon')}</AlertTitle>
            <AlertDescription>
            {t('check_for_updates_in_our')}{" "}
              <a
                href="https://t.me/rocketraffle"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.telegramLink}
              >
                Telegram
              </a>
            </AlertDescription>
          </div>
        </div>
        <button className={styles.alertButton} onClick={handleCloseAlert}>
          OK
        </button>
      </Alert>
    )
  );
});

export default SoonAlert;
