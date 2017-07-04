/**
 * @module core
 */
/** */
import {Store} from "./Store";
import {NotEnumerable} from "../decorators/enumerable";
import {Type} from "../interfaces/Type";
import {EntityDescription} from "./EntityDescription";

export abstract class Storable extends EntityDescription {

    @NotEnumerable()
    protected _store: Store;

    constructor(_target: Type<any>,
                _propertyKey: string | symbol,
                _index?: any) {
        super(_target, _propertyKey, _index);
        this._store = Store.from(_target, _propertyKey, _index);
    }

    /**
     *
     * @returns {Store}
     */
    public get store(): Store {
        return this._store;
    }

}