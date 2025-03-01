import { CurrentRaffle, RaffleHistory, RafflePackage } from "@/types/types";
import { makeAutoObservable } from "mobx";
import { confirmTicketPurchase, getCurrentRaffle, getRaffleHistory, getRaffleTicketPackages } from "@/http/raffleAPI";

export default class RaffleStore {
    _rafflePackages: RafflePackage[] = [];
    _loading = false;
    _currentRaffle: CurrentRaffle | null = null;
    _raffleHistory: RaffleHistory | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setRafflePackages(packages: RafflePackage[]) {
        this._rafflePackages = packages;
    }

    setLoading(loading: boolean) {
        this._loading = loading;
    }

    setCurrentRaffle(raffle: CurrentRaffle) {
        this._currentRaffle = raffle;
    }

    setRaffleHistory(history: RaffleHistory) {
        this._raffleHistory = history;
    }

    async fetchRafflePackages() {
        try {
            this.setLoading(true);
            const packages = await getRaffleTicketPackages();
            this.setRafflePackages(packages);
        } catch (error) {
            console.error("Error fetching raffle packages:", error);
        } finally {
            this.setLoading(false);
        }
    }

    async fetchCurrentRaffle() {
        try {
            const currentRaffle = await getCurrentRaffle();
            this.setCurrentRaffle(currentRaffle);
        } catch (error) {
            console.error("Error fetching current raffle:", error);
        } finally {
            this.setLoading(false);
        }
    }

    async fetchRaffleHistory() {
        try {
            const history = await getRaffleHistory();
            this.setRaffleHistory(history);
        } catch (error) {
            console.error("Error fetching raffle history:", error);
        } finally {
            this.setLoading(false);
        }
    }

    async confirmRaffleTicketPurchase(
        userId: number, 
        packageId: number, 
        transactionBoc: string,
        payloadData?: string // Изменили тип с BOC на простую строку
    ) {
        try {
            this.setLoading(true);
            const result = await confirmTicketPurchase(
                userId, 
                packageId, 
                transactionBoc,
                payloadData
            );
            return result;
        } catch (error) {
            console.error("Error confirming ticket purchase:", error);
            return null;
        } finally {
            this.setLoading(false);
        }
    }

    get rafflePackages() {
        return this._rafflePackages;
    }

    get currentRaffle() {
        return this._currentRaffle;
    }

    get raffleHistory() {
        return this._raffleHistory;
    }
    get loading() {
        return this._loading;
    }
}
