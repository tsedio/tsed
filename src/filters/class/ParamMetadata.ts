import {Storable} from "../../core/class/Storable";
import {NotEnumerable} from "../../core/decorators";
import {Type} from "../../core/interfaces";
import {nameOf} from "../../core/utils";
import {IParamOptions} from "../interfaces";

export class ParamMetadata extends Storable implements IParamOptions<any> {
    /**
     *
     */
    @NotEnumerable()
    protected _expression: string | RegExp;
    /**
     *
     * @type {boolean}
     */
    @NotEnumerable()
    protected _useConverter: boolean = true;

    /**
     *
     */
    @NotEnumerable()
    protected _service: string | Type<any> | symbol;

    /**
     * Allowed value when the entity is required.
     * @type {Array}
     */
    @NotEnumerable()
    private _allowedValues: any[] = [];

    /**
     * Required entity.
     */
    @NotEnumerable()
    protected _required: boolean = false;

    /**
     *
     * @returns {string|RegExp}
     */
    get expression(): string | RegExp {
        return this._expression;
    }

    /**
     *
     * @param value
     */
    set expression(value: string | RegExp) {
        this._expression = value;
    }

    /**
     *
     * @returns {symbol}
     */
    get service(): Type<any> | symbol {
        return <any>this._service;
    }

    /**
     *
     * @param value
     */
    set service(value: Type<any> | symbol) {
        this._service = value;
        this.name = nameOf(value);
    }

    /**
     *
     * @param value
     */
    set useConverter(value: boolean) {
        this._useConverter = value;
    }

    /**
     *
     * @returns {boolean}
     */
    get useConverter(): boolean {
        return this._useConverter;
    }

    /**
     * Return the required state.
     * @returns {boolean}
     */
    get required(): boolean {
        return this._required;
    }

    /**
     * Change the state of the required data.
     * @param value
     */
    set required(value: boolean) {
        this._required = value;
    }

    /**
     * Return the allowed values.
     * @returns {any[]}
     */
    get allowedValues(): any[] {
        return this._allowedValues;
    }

    /**
     * Set the allowed values when the value is required.
     * @param {any[]} value
     */
    set allowedValues(value: any[]) {
        this._allowedValues = value;
    }

    /**
     * This method use `EntityDescription.required` and `allowedValues` to validate the value.
     * @param value
     * @returns {boolean}
     */
    isValidValue(value: any): boolean {
        if (this.required) {
            if (value === undefined || value === null || value === "") {
                if (this.allowedValues.indexOf(value) === -1) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     *
     * @returns {{service: (string|symbol), name: string, expression: string, required: boolean, use: undefined, baseType: undefined}}
     */
    toJSON() {
        return {
            service: nameOf(this._service),
            name: this.name,
            expression: this._expression,
            required: this._required,
            use: this.typeName,
            baseType: this.collectionName
        };
    }
}