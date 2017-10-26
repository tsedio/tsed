import {NotEnumerable} from "../decorators";
import {Type} from "../interfaces";
/**
 * @module common/core
 */
/** */
import {
    getClass,
    isArrayOrArrayClass,
    isClass,
    isCollection,
    isDate,
    isObject,
    isPrimitiveOrPrimitiveClass,
    nameOf
} from "../utils";
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
    get index(): number {
        return this._index;
    }

    /**
     * Class of the entity.
     * @returns {Type<any>}
     */
    get target(): Type<any> {
        return getClass(this._target);
    }

    /**
     *
     * @param {Type<any>} target
     */
    set target(target: Type<any>) {
        this.setTarget(target);
    }

    /**
     * Return the class name of the entity.
     * @returns {string}
     */
    get targetName(): string {
        return nameOf(this.target);
    }

    /**
     * Name of the method or attribute related to the class.
     * @returns {string|symbol}
     */
    get propertyKey(): string | symbol {
        return this._propertyKey;
    }

    /**
     *
     * @param value
     */
    set type(value: Type<any>) {
        this._type = value || Object;
    }

    /**
     *
     * @returns {Type<any>}
     */
    get type(): Type<any> {
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
    get collectionType(): Type<any> {
        return this._collectionType;
    }

    /**
     *
     * @param {Type<any>} collectionType
     */
    set collectionType(collectionType: Type<any>) {
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
    get isCollection(): boolean {
        return !!this._collectionType;
    }

    /**
     *
     * @returns {boolean}
     */
    get isArray() {
        return isArrayOrArrayClass(this._collectionType);
    }

    /**
     *
     * @returns {boolean}
     */
    get isPrimitive() {
        return isPrimitiveOrPrimitiveClass(this._type);
    }

    /**
     *
     * @returns {boolean}
     */
    get isDate() {
        return isDate(this._type);
    }

    /**
     *
     * @returns {boolean}
     */
    get isObject() {
        return isObject(this.type);
    }

    /**
     *
     * @returns {boolean}
     */
    get isClass() {
        return isClass(this.type);
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
     * @param {string} value
     */
    set name(value: string) {
        this._name = value;
    }

    protected setTarget(target: Type<any>): void {
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
}