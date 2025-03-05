import { CurrentRaffle, RaffleHistory, RafflePackage, PreviousRaffle, UserTickets } from "@/types/types";
import { makeAutoObservable } from "mobx";
import { 
    confirmTicketPurchase, 
    getCurrentRaffle, 
    getRaffleHistory, 
    getRaffleTicketPackages,
    getPreviousRaffle,
    getUserTickets,
    initTicketPurchase,
    getTransactionStatus
} from "@/http/raffleAPI";

export default class RaffleStore {
    _rafflePackages: RafflePackage[] = [];
    _loading = false;
    _currentRaffle: CurrentRaffle | null = null;
    _raffleHistory: RaffleHistory | null = null;
    _previousRaffle: PreviousRaffle | null = null;
    _userTickets: UserTickets | null = null;

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

    setPreviousRaffle(raffle: PreviousRaffle) {
        this._previousRaffle = raffle;
    }

    setUserTickets(tickets: UserTickets) {
        this._userTickets = tickets;
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

    async fetchPreviousRaffle() {
        try {
            this.setLoading(true);
            const previousRaffle = await getPreviousRaffle();
            this.setPreviousRaffle(previousRaffle);
        } catch (error) {
            console.error("Error fetching previous raffle:", error);
        } finally {
            this.setLoading(false);
        }
    }

    async fetchUserTickets() {
        try {
            this.setLoading(true);
            const userTickets = await getUserTickets();
            this.setUserTickets(userTickets);
        } catch (error) {
            console.error("Error fetching user tickets:", error);
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

    async initRaffleTicketPurchase(
        userId: number,
        packageId: number,
        rawPayload: string,
        uniqueId: string
    ) {
        try {
            this.setLoading(true);
            const result = await initTicketPurchase(
                userId,
                packageId,
                rawPayload,
                uniqueId
            );
            return result;
        } catch (error) {
            console.error("Error initiating ticket purchase:", error);
            return null;
        } finally {
            this.setLoading(false);
        }
    }

    async checkTransactionStatus(userId: number, uniqueId: string) {
        try {
            const status = await getTransactionStatus(userId, uniqueId);
            return status;
        } catch (error) {
            console.error("Error checking transaction status:", error);
            return null;
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

    get previousRaffle() {
        return this._previousRaffle;
    }

    get userTickets() {
        return this._userTickets;
    }

    get loading() {
        return this._loading;
    }
}
