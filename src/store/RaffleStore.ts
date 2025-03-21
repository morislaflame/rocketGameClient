import { 
    getCurrentRaffle, 
    getRaffleHistory, 
    getRaffleTicketPackages,
    getPreviousRaffle,
    getUserTickets,
    initTicketPurchase,
    getTransactionStatus,
    getRaffleById,
    cancelTransaction
} from "@/http/raffleAPI";
import { CurrentRaffle, RaffleHistory, RafflePackage, PreviousRaffle, UserTickets, SelectedRaffle } from "@/types/types";
import { makeAutoObservable } from "mobx";

export default class RaffleStore {
    _rafflePackages: RafflePackage[] = [];
    _currentRaffle: CurrentRaffle | null = null;
    _raffleHistory: RaffleHistory | null = null;
    _previousRaffle: PreviousRaffle | null = null;
    _userTickets: UserTickets | null = null;
    _selectedRaffle: SelectedRaffle | null = null;

    _loadingRafflePackages: boolean = false;
    _loadingCurrentRaffle: boolean = false;
    _loadingPreviousRaffle: boolean = false;
    _loadingRaffleHistory: boolean = false;
    _loadingUserTickets: boolean = false;
    _loadingTicketPurchase: boolean = false;
    _loadingSelectedRaffle: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    // Setters для данных
    setRafflePackages(packages: RafflePackage[]) {
        this._rafflePackages = packages;
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

    setSelectedRaffle(raffle: SelectedRaffle) {
        this._selectedRaffle = raffle;
    }

    // Setters для состояний загрузки
    setLoadingRafflePackages(loading: boolean) {
        this._loadingRafflePackages = loading;
    }

    setLoadingCurrentRaffle(loading: boolean) {
        this._loadingCurrentRaffle = loading;
    }

    setLoadingPreviousRaffle(loading: boolean) {
        this._loadingPreviousRaffle = loading;
    }

    setLoadingRaffleHistory(loading: boolean) {
        this._loadingRaffleHistory = loading;
    }

    setLoadingUserTickets(loading: boolean) {
        this._loadingUserTickets = loading;
    }

    setLoadingTicketPurchase(loading: boolean) {
        this._loadingTicketPurchase = loading;
    }

    setLoadingSelectedRaffle(loading: boolean) {
        this._loadingSelectedRaffle = loading;
    }

    // Методы для загрузки данных

    async fetchRafflePackages() {
        try {
            this.setLoadingRafflePackages(true);
            const packages = await getRaffleTicketPackages();
            this.setRafflePackages(packages);
        } catch (error) {
            console.error("Error fetching raffle packages:", error);
        } finally {
            this.setLoadingRafflePackages(false);
        }
    }

    async fetchCurrentRaffle() {
        try {
            this.setLoadingCurrentRaffle(true);
            const currentRaffle = await getCurrentRaffle();
            this.setCurrentRaffle(currentRaffle);
        } catch (error) {
            console.error("Error fetching current raffle:", error);
        } finally {
            this.setLoadingCurrentRaffle(false);
        }
    }
      
    async fetchPreviousRaffle() {
        try {
            this.setLoadingPreviousRaffle(true);
            const previousRaffle = await getPreviousRaffle();
            this.setPreviousRaffle(previousRaffle);
        } catch (error) {
            console.error("Error fetching previous raffle:", error);
        } finally {
            this.setLoadingPreviousRaffle(false);
        }
    }

    async fetchRaffleHistory(limit = 10, offset = 0, append = false) {
        try {
            this.setLoadingRaffleHistory(true);
            const history = await getRaffleHistory(limit, offset);
            if (append && this._raffleHistory) {
                this.setRaffleHistory([...this._raffleHistory, ...history]);
            } else {
                this.setRaffleHistory(history);
            }
            return history;
        } catch (error) {
            console.error("Error fetching raffle history:", error);
            return [];
        } finally {
            this.setLoadingRaffleHistory(false);
        }
    }

    async fetchUserTickets() {
        try {
            this.setLoadingUserTickets(true);
            const userTickets = await getUserTickets();
            this.setUserTickets(userTickets);
        } catch (error) {
            console.error("Error fetching user tickets:", error);
        } finally {
            this.setLoadingUserTickets(false);
        }
    }

    async initRaffleTicketPurchase(
        userId: number,
        packageId: number,
        rawPayload: string,
        uniqueId: string,
        bonusId?: number
    ) {
        try {
            this.setLoadingTicketPurchase(true);
            const result = await initTicketPurchase(
                userId,
                packageId,
                rawPayload,
                uniqueId,
                bonusId
            );
            return result;
        } catch (error) {
            console.error("Error initiating ticket purchase:", error);
            return null;
        } finally {
            this.setLoadingTicketPurchase(false);
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

    async cancelTransaction(userId: number, uniqueId: string, errorType: string) {
        try {
          const result = await cancelTransaction(userId, uniqueId, errorType);
          return result;
        } catch (error) {
          console.error("Error cancelling transaction:", error);
          return null;
        }
      }

    async fetchRaffleById(id: string | number) {
        try {
            this.setLoadingSelectedRaffle(true);
            const raffle = await getRaffleById(id);
            this.setSelectedRaffle(raffle);
            return raffle;
        } catch (error) {
            console.error("Error fetching raffle by id:", error);
            return null;
        } finally {
            this.setLoadingSelectedRaffle(false);
        }
    }

    // Геттеры для данных
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

    get selectedRaffle() {
        return this._selectedRaffle;
    }

    // Геттеры для состояний загрузки
    get loadingRafflePackages() {
        return this._loadingRafflePackages;
    }

    get loadingCurrentRaffle() {
        return this._loadingCurrentRaffle;
    }

    get loadingPreviousRaffle() {
        return this._loadingPreviousRaffle;
    }

    get loadingRaffleHistory() {
        return this._loadingRaffleHistory;
    }

    get loadingUserTickets() {
        return this._loadingUserTickets;
    }

    get loadingTicketPurchase() {
        return this._loadingTicketPurchase;
    }

    get loadingSelectedRaffle() {
        return this._loadingSelectedRaffle;
    }
}
