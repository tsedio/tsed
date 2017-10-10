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