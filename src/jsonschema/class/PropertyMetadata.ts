import {IPropertyOptions} from "../../converters/interfaces/IPropertyOptions";
import {Storable} from "../../core/class/Storable";
import {NotEnumerable} from "../../core/decorators";
import {Type} from "../../core/interfaces";
import {JsonSchemesRegistry} from "../registries/JsonSchemesRegistry";
import {JsonSchema} from "./JsonSchema";

export class PropertyMetadata extends Storable implements IPropertyOptions {
    /**
     * Allowed value when the entity is required.
     * @type {Array}
     */
    @NotEnumerable()
    private _allowedRequiredValues: any[] = [];

    constructor(target: any, propertyKey: any) {
        super(target, propertyKey);
        JsonSchemesRegistry.property(this.target, this.propertyKey as string, this.type, this.collectionType);
    }

    /**
     *
     * @param value
     */
    set type(value: Type<any>) {
        this._type = value || Object;
        JsonSchemesRegistry.property(this.target, this.propertyKey as string, this.type, this.collectionType);
    }

    /**
     *
     * @returns {Type<any>}
     */
    get type(): Type<any> {
        return this._type;
    }

    get schema(): JsonSchema {
        if (!this.store.has("schema")) {
            const schema = JsonSchemesRegistry.property(this.target, this.propertyKey as string, this.type, this.collectionType);
            this.store.set("schema", schema);
        }
        return this.store.get("schema");
    }

    /**
     * Return the required state.
     * @returns {boolean}
     */
    get required(): boolean {
        return JsonSchemesRegistry.required(this.target, this.propertyKey as string);
    }

    /**
     * Change the state of the required data.
     * @param value
     */
    set required(value: boolean) {
        JsonSchemesRegistry.required(this.target, this.propertyKey as string, value);
    }

    /**
     * Return the allowed values.
     * @returns {any[]}
     */
    get allowedRequiredValues(): any[] {
        return this._allowedRequiredValues;
    }

    /**
     * Set the allowed values when the value is required.
     * @param {any[]} value
     */
    set allowedRequiredValues(value: any[]) {
        this._allowedRequiredValues = value;
    }

    isValidRequiredValue(value: any): boolean {
        if (this.required) {
            if (value === undefined || value === null || value === "") {
                if (this.allowedRequiredValues.indexOf(value) === -1) {
                    return false;
                }
            }
        }
        return true;
    }
}