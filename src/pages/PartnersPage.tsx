import React, { useContext, useEffect } from 'react';
import { Context, IStoreContext } from '@/store/StoreProvider';
import { observer } from 'mobx-react-lite';
import { ReferralSpendingChart } from '@/components/ReferralComponents/ReferralSpendingChart';
import { Card, CardDescription, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PartnersPage: React.FC = observer(() => {
    const { user } = useContext(Context) as IStoreContext;

    useEffect(() => {
        loadUserInfo();
    }, []);
    
    const generateReferralCode = async () => {
        try {
            await user.generateReferralCode();

        } catch (error) {
            console.error('Error generating referral code:', error);
        }
    }

    const loadUserInfo = async () => {
        try {
            await user.fetchMyInfo();
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    }

    const hasReferralCode = user.referralCode !== null;

  return (
    <div className='flex flex-col items-center h-screen p-4'>
        <div className='flex flex-col items-center gap-2 mb-4'>
            <h2 className='text-3xl font-bold'>Affiliate Program</h2>
        </div>
        <div className='flex flex-col items-center gap-3 mb-4'>
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Your referral code</CardTitle>
                <CardDescription>Share this code with your friends to receive 30% of their deposits</CardDescription>
            </CardHeader>
            <CardContent>
                {hasReferralCode ? (
                <p>Your code: {user.referralCode}</p>
                ) : (
                <Button onClick={generateReferralCode}>Generate code</Button>
                )}
            </CardContent>
        </Card>
        <ReferralSpendingChart />
      </div>
    </div>
  );
});

export default PartnersPage;


