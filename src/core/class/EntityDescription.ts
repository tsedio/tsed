import {NotEnumerable} from "../decorators";
import {Type} from "../interfaces";
/**
 * @module common/core
 */
/** */
import {getClass, isArrayOrArrayClass, isCollection, isPrimitiveOrPrimitiveClass, isPromise, nameOf} from "../utils";
import {Metadata} from "./Metadata";

export abstract class EntityDescription {

    /**
     *
     */
    @NotEnumerable()
    protected _collectionType: Type<any>;
    /**
     *
     */
    @NotEnumerable()
    private _name: string;

    /**
     *
     */
    @NotEnumerable()
    protected _type: Type<any>;

    constructor(protected _target: Type<any>,
                protected _propertyKey: string | symbol,
                protected _index?: any) {

        this.target = _target;
    }


    /**
     *
     * @returns {any}
     */
    public get index(): any {
        return typeof this._index === "number" ? this._index : undefined;
    }

    /**
     *
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
     *
     * @returns {string}
     */
    public get targetName(): string {
        return nameOf(this.target);
    }

    /**
     *
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

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }
}