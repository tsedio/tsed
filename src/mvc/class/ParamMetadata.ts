/**
 * @module mvc
 */ /** */

import {IInjectableParamsMetadata} from "../interfaces";
import {NotEnumerable} from "../../core/decorators/enumerable";
import {nameOf} from "../../core/utils/index";
import {Type} from "../../core/interfaces/Type";
/**
 *
 */
export class ParamMetadata implements IInjectableParamsMetadata<any> {

    /**
     *
     */
    @NotEnumerable()
    private _required: boolean;
    /**
     *
     */
    @NotEnumerable()
    private _expression: string | RegExp;
    /**
     *
     */
    @NotEnumerable()
    private _useType: Type<any>;
    /**
     *
     * @type {boolean}
     */
    @NotEnumerable()
    private _useConverter: boolean = true;
    /**
     *
     */
    @NotEnumerable()
    private _baseType: Type<any>;
    /**
     *
     */
    @NotEnumerable()
    private _service: string | Type<any> | symbol;
    /**
     *
     */
    @NotEnumerable()
    private _name: string;

    /**
     *
     * @returns {boolean}
     */
    get required(): boolean {
        return this._required;
    }

    /**
     *
     * @param value
     */
    set required(value: boolean) {
        this._required = value;
    }

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
        this._name = nameOf(value);
    }

    /**
     *
     * @returns {string}
     */
    get name(): string {
        return this._name;
    }

    /**
     *
     * @param value
     */
    set useType(value: Type<any>) {
        this._useType = value;
    }

    /**
     *
     * @returns {Type<any>}
     */
    get useType(): Type<any> {
        return this._useType;
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
     * @param value
     */
    set baseType(value: Type<any>) {
        this._baseType = value;
    }

    /**
     *
     * @returns {Type<any>}
     */
    get baseType(): Type<any> {
        return this._baseType;
    }

    /**
     *
     * @returns {{service: (string|symbol), name: string, expression: string, required: boolean, use: undefined, baseType: undefined}}
     */
    toJSON() {

        const use = this._useType ? nameOf(this._useType) : undefined;
        const baseType = this._baseType && use !== nameOf(this._baseType) ? nameOf(this._baseType) : undefined;

        return {
            service: nameOf(this._service),
            name: this._name,
            expression: this._expression,
            required: this._required,
            use,
            baseType: baseType
        };
    }
}