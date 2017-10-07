import {NotEnumerable} from "../decorators";
import {Type} from "../interfaces";
/**
 * @module common/core
 */
/** */
import {getClass, isArrayOrArrayClass, isCollection, isPrimitiveOrPrimitiveClass, isPromise, nameOf} from "../utils";
import {Metadata} from "./Metadata";

/**
 * EntityDescription store all information collected by a decorator (class, property key and in option the index of the parameters).
 */
export abstract class EntityDescription {

    /**
     * Type of the collection (Array, Map, Set, etc...)
     */
    @NotEnumerable()
    protected _collectionType: Type<any>;
    /**
     * Custom name.
     */
    @NotEnumerable()
    private _name: string;

    /**
     * Type of the entity.
     */
    @NotEnumerable()
    protected _type: Type<any>;

    /**
     * Index of the entity. Only used when the entity describe a parameters.
     */
    @NotEnumerable()
    protected _index: number;

    /**
     * Required entity.
     */
    @NotEnumerable()
    protected _required: boolean = false;

    /**
     * Allowed value when the entity is required.
     * @type {Array}
     */
    @NotEnumerable()
    private _allowedValues: any[] = [];

    constructor(protected _target: Type<any>,
                protected _propertyKey: string | symbol,
                index?: number | PropertyDescriptor) {

        if (typeof index === "number") {
            this._index = index;
        }
        this.target = _target;
    }

    /**
     * Return the index of the parameters.
     * @returns {any}
     */
    public get index(): number {
        return this._index;
    }

    /**
     * Class of the entity.
     * @returns {Type<any>}
     */
    public get target(): Type<any> {
        return getClass(this._target);
    }

    /**
     *
     * @param {Type<any>} target
     */
    public set target(target: Type<any>) {
        this._target = target;
        let type;

        if (typeof this._index === "number") {
            type = Metadata.getParamTypes(this._target, this._propertyKey)[this._index];
        } else {
            type = Metadata.getType(this._target, this._propertyKey);
        }

        if (isCollection(type)) {
            this._collectionType = type;
            this._type = Object;
        } else {
            this._type = type;
        }

        this._name = nameOf(this._propertyKey);
    }

    /**
     * Return the class name of the entity.
     * @returns {string}
     */
    public get targetName(): string {
        return nameOf(this.target);
    }

    /**
     * Name of the method or attribute related to the class.
     * @returns {string|symbol}
     */
    public get propertyKey(): string | symbol {
        return this._propertyKey;
    }

    /**
     *
     * @param value
     */
    public set type(value: Type<any>) {
        this._type = value || Object;
    }

    /**
     *
     * @returns {Type<any>}
     */
    public get type(): Type<any> {
        return this._type;
    }

    /**
     *
     * @returns {string}
     */
    get typeName(): string {
        return nameOf(this._type);
    }

    /**
     *
     * @returns {any}
     */
    public get collectionType(): Type<any> {
        return this._collectionType;
    }

    /**
     *
     * @param {Type<any>} collectionType
     */
    public set collectionType(collectionType: Type<any>) {
        this._collectionType = collectionType;
    }

    /**
     *
     * @returns {string}
     */
    get collectionName(): string {
        return this._collectionType ? nameOf(this._collectionType) : "";
    }


    /**
     *
     * @returns {boolean}
     */
    public get isCollection(): boolean {
        return !!this._collectionType;
    }

    /**
     *
     * @returns {boolean}
     */
    public get isArray() {
        return isArrayOrArrayClass(this._collectionType);
    }

    /**
     *
     * @returns {boolean}
     */
    public get isPrimitive() {
        return isPrimitiveOrPrimitiveClass(this._type);
    }

    /**
     *
     * @returns {boolean}
     */
    public get isDate() {
        return this._type === Date || this._type instanceof Date;
    }

    /**
     *
     * @returns {boolean}
     */
    public get isObject() {
        return this.type === Object;
    }

    /**
     *
     * @returns {boolean}
     */
    public get isClass() {
        return !this.isPrimitive && !this.isObject && !this.isDate && this.type !== undefined && !isPromise(this.type);
    }

    /**
     *
     * @returns {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     *
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
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
}