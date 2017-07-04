/**
 * @module converters
 */
/** */
import {Type} from "../../core/interfaces/Type";
import {NotEnumerable} from "../../core/decorators/enumerable";
import {Storable} from "../../core/class/Storable";

export interface IPropertyOptions {
    name?: string;
    use?: Type<any>;
}

export class PropertyMetadata extends Storable implements IPropertyOptions {
    /**
     *
     */
    @NotEnumerable()
    protected _required: boolean = false;

    constructor(target, propertyKey) {
        super(target, propertyKey);
    }

    /**
     *
     * @returns {boolean}
     */
    public get required(): boolean {
        return this._required;
    }

    /**
     *
     * @param value
     */
    public set required(value: boolean) {
        this._required = value;
    }
}