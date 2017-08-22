import {Storable} from "../../core/class/Storable";
import {NotEnumerable} from "../../core/decorators";
/**
 * @module common/converters
 */
/** */
import {IPropertyOptions} from "../interfaces/IPropertyOptions";

export class PropertyMetadata extends Storable implements IPropertyOptions {
    /**
     *
     */
    @NotEnumerable()
    protected _required: boolean = false;

    constructor(target: any, propertyKey: any) {
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