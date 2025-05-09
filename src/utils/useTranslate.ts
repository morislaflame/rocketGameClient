import { useContext } from 'react';
import { Context, IStoreContext } from '@/store/StoreProvider';
import { translate } from '@/utils/translations';

export const useTranslate = () => {
  const { user } = useContext(Context) as IStoreContext;
  
  const t = (key: string) => {
    return translate(key, user.language);
  };
  
  return { t, language: user.language };
};