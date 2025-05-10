import React, { useContext } from 'react';
import { Context, IStoreContext } from '@/store/StoreProvider';
import { Button } from '@/components/ui/button';
import { observer } from 'mobx-react-lite';
import styles from './FunctionalComponents.module.css';

const LanguageSwitcher: React.FC = observer(() => {
  const { user } = useContext(Context) as IStoreContext;
  
  const toggleLanguage = () => {
    user.setLanguage(user.language === 'ru' ? 'en' : 'ru');
  };
  
  return (
    <Button onClick={toggleLanguage} variant="outline" size="sm" className={styles.languageSwitcher}>
      {user.language === 'ru' ? 'RU' : 'EN'}
    </Button>
  );
});

export default LanguageSwitcher;