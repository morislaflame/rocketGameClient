import React, { useContext, useEffect } from 'react';
import { Context, IStoreContext } from '@/store/StoreProvider';
import { observer } from 'mobx-react-lite';
import { ReferralSpendingChart } from '@/components/ReferralComponents/ReferralSpendingChart';
import { Card, CardDescription, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME;  // <-- Замените на реальное имя бота
const APP_NAME = import.meta.env.VITE_APP_NAME;          // <-- Замените на реальное название мини-приложения

const PartnersPage: React.FC = observer(() => {
  const { user } = useContext(Context) as IStoreContext;

  useEffect(() => {
    loadUserInfo();
  }, []);
  
  const loadUserInfo = async () => {
    try {
      await user.fetchMyInfo();
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const generateReferralCode = async () => {
    try {
      await user.generateReferralCode();
    } catch (error) {
      console.error('Error generating referral code:', error);
    }
  };

  // Проверка, есть ли код
  const hasReferralCode = user.referralCode !== null;

  // Формируем ссылку для Telegram Mini App:
  // https://t.me/<BOT_USERNAME>/<APP_NAME>?startapp=<CODE>
  const referralLink = hasReferralCode
    ? `https://t.me/${BOT_USERNAME}/${APP_NAME}?startapp=${user.referralCode}`
    : null;

  // Функция копирования
  const handleCopyLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink)
        .then(() => {
          alert('Referral link copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy link: ', err);
        });
    }
  };

  return (
    <div className="flex flex-col items-center h-screen p-4">
      <div className="flex flex-col items-center gap-2 mb-4">
        <h2 className="text-3xl font-bold">Affiliate Program</h2>
      </div>
      <div className="flex flex-col items-center gap-3 mb-4 w-full">
        <Card className="w-full max-w-[600px]">
          <CardHeader>
            <CardTitle>Your referral code</CardTitle>
            <CardDescription>
              Share this link with your friends to receive 30% of their deposits
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasReferralCode ? (
              <div className="flex flex-col gap-2">
                {/* Отображаем сам код и/или ссылку */}
                <p>Your code: <b>{user.referralCode}</b></p>
                
                {/* Отображаем ссылку, при клике копируем */}
                {referralLink && (
                  <div
                    className="text-blue-600 underline cursor-pointer"
                    onClick={handleCopyLink}
                  >
                    {referralLink}
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  (Click the link to copy)
                </p>
              </div>
            ) : (
              <Button onClick={generateReferralCode}>Generate code</Button>
            )}
          </CardContent>
        </Card>
        
        {/* Диаграмма с тратами рефералов */}
        <ReferralSpendingChart />
      </div>
    </div>
  );
});

export default PartnersPage;
