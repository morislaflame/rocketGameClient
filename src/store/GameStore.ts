import { makeAutoObservable } from "mobx";
import { launchRocket } from "../http/gameAPI";

export default class GameStore {
    _rocketResult: number | null = null;
    _newBalance: number | null = null;
    _loading: boolean = false;
    _error: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setRocketResult(rocketResult: number | null) {
        this._rocketResult = rocketResult;
    }

    setNewBalance(newBalance: number | null) {
        this._newBalance = newBalance;
    }

    setLoading(loading: boolean) {
        this._loading = loading;
    }

    setError(error: boolean) {
        this._error = error;
    }



    async launchRocket() {
        try {
            this.setLoading(true);
            const data = await launchRocket();
            this.setRocketResult(data.rocketResult);
            this.setNewBalance(data.newBalance);
            this.setLoading(false);
        } catch (error) {
            console.error("Error during launching rocket:", error);
            this.setError(true);
            this.setLoading(false);
        }
    }

    
    get rocketResult() {
        return this._rocketResult;
    }

    get newBalance() {
        return this._newBalance;
    }

    get loading() {
        return this._loading;
    }

    get error() {
        return this._error;
    }
    
}