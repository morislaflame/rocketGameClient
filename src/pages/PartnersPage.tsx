import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Context, IStoreContext } from '@/store/StoreProvider';
import { observer } from 'mobx-react-lite';
import { ReferralSpendingChart } from '@/components/ReferralComponents/ReferralSpendingChart';
import { Card, CardDescription, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import useBackButton from '../utils/useBackButton';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME;
const APP_NAME = import.meta.env.VITE_APP_NAME;

const PartnersPage: React.FC = observer(() => {
  const { user } = useContext(Context) as IStoreContext;
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // Новый локальный стейт для отображения «Copied!»
  const [copied, setCopied] = useState(false);

   const navigate = useNavigate();
  
  // Показать кнопку и назначить обработчик для возврата назад
  useBackButton(true, () => navigate(-1));

  useEffect(() => {
    loadUserInfo();
  }, []);

  useLayoutEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
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
      setLoading(true);
      await user.generateReferralCode();
    } catch (error) {
      console.error('Error generating referral code:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasReferralCode = user.referralCode !== null;
  const referralLink = hasReferralCode
    ? `https://t.me/${BOT_USERNAME}/${APP_NAME}?startapp=${user.referralCode}`
    : null;

  const handleCopyLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink)
        .then(() => {
          // При успешном копировании ставим copied = true
          setCopied(true);

          // Дополнительно можем вернуть обратно через 2 секунды
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => console.error('Failed to copy link: ', err));
    }
  };

  return (
    <div className="flex flex-col items-center h-screen p-4" ref={containerRef}>
      <ScrollArea className="flex-1 w-full">
        <div className="flex flex-col items-center gap-2 mb-4">
          <h2 className="text-3xl font-bold">Affiliate Program</h2>
        </div>

        <div className="flex flex-col items-center gap-3 mb-4 w-full">
          <Card className="w-full max-w-[600px]">
            <CardHeader>
              <CardTitle>Your referral link</CardTitle>
              <CardDescription>
                Share this link with your friends to receive 30% of their deposits
              </CardDescription>
            </CardHeader>

            <CardContent>
              {hasReferralCode ? (
                <div className="flex flex-col gap-2">
                  {/* Сама ссылка */}
                  {referralLink && (
                    <div
                      className="text-white underline cursor-pointer"
                      onClick={handleCopyLink}
                    >
                      {referralLink}
                    </div>
                  )}
                  {/* Если скопировано, показываем "Copied!", иначе - "(Click the link to copy)" */}
                  {copied ? (
                    <p className="text-sm text-green-500 font-semibold">Copied!</p>
                  ) : (
                    <p className="text-sm text-gray-500">(Click the link to copy)</p>
                  )}
                </div>
              ) : (
                <Button onClick={generateReferralCode} disabled={loading}>
                  {loading ? 'Generating...' : 'Generate code'}
                </Button>
              )}
            </CardContent>
          </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Terms of partnership</CardTitle>
                  <CardDescription>
                      Payments are made twice a month - on the 2nd and 16th of the month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Submit a payout request to our support:
                  </p>
                  <p>
                    <a href="https://t.me/Rocket_Raffle" className="text-blue-500 underline">
                      @Rocket_Raffle
                    </a>
                  </p>
                </CardContent>
              </Card>

          <ReferralSpendingChart />
        </div>
      </ScrollArea>
    </div>
  );
});

export default PartnersPage;
