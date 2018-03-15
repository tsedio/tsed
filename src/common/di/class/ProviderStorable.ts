import {Store, Type} from "@tsed/core";
import {globalServerSettings} from "../../config/services/GlobalSettings";
import {ProviderScope} from "../interfaces";

import {Provider} from "./Provider";

export class ProviderStorable<T> extends Provider<T> {
    private _store: Store;

    constructor(provide: any) {
        super(provide);
        this._store = Store.from(provide);
    }

    /**
     *
     * @returns {Type<T>}
     */
    get useClass(): Type<T> {
        return this._useClass || this._provide;
    }

    /**
     *
     * @param value
     */
    set useClass(value: Type<T>) {
        this._store = Store.from(value);
        this._useClass = value;
    }

    /**
     *
     * @returns {Store}
     */
    public get store(): Store {
        return this._store;
    }

    /**
     * Get the scope of the provider.
     * @returns {boolean}
     */
    get scope(): ProviderScope {
        return this.store.get("scope") || globalServerSettings.controllerScope;
    }

    /**
     * Change the scope value of the provider.
     * @param scope
     */
    set scope(scope: ProviderScope) {
        this.store.set("scope", scope);
    }
}