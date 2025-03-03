import { makeAutoObservable, runInAction } from 'mobx';
import { getUserPrizes, sellPrize, receivePrize } from '@/http/userPrizeAPI';
import { UserPrize } from '@/types/types';

export default class UserPrizeStore {
  userPrizes: UserPrize[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUserPrizes(prizes: UserPrize[]) {
    this.userPrizes = prizes;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  async fetchUserPrizes() {
    this.setLoading(true);
    this.setError(null);
    try {
      const data = await getUserPrizes();
      runInAction(() => {
        this.userPrizes = data;
      });
      return data;
    } catch (error) {
      console.error('Error fetching prizes:', error);
      if (error instanceof Error) {
        this.setError(error.message);
      } else {
        this.setError('Unknown error fetching prizes');
      }
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  async sellUserPrize(prizeId: number) {
    this.setLoading(true);
    this.setError(null);
    try {
      const result = await sellPrize(prizeId);
      // Обновляем список призов после продажи
      await this.fetchUserPrizes();
      return result;
    } catch (error) {
      console.error('Error selling prize:', error);
      if (error instanceof Error) {
        this.setError(error.message);
      } else {
        this.setError('Unknown error selling prize');
      }
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  async receiveUserPrize(prizeId: number, deliveryDetails: string) {
    this.setLoading(true);
    this.setError(null);
    try {
      const result = await receivePrize(prizeId, deliveryDetails);
      // Обновляем список призов после запроса
      await this.fetchUserPrizes();
      return result;
    } catch (error) {
      console.error('Error requesting prize:', error);
      if (error instanceof Error) {
        this.setError(error.message);
      } else {
        this.setError('Unknown error requesting prize');
      }
      return null;
    } finally {
      this.setLoading(false);
    }
  }
}