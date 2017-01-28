import {DESIGN_TYPE, DESIGN_PARAM_TYPES} from "../constants/metadata-keys";
import {getClass} from "../utils/utils";
require("reflect-metadata");

const PROPERTIES: Map<string, any[]> = new Map<string, any[]>();
/**
 *
 */
export default class Metadata<T> {

    constructor (
        private key: string,
        private target: any,
        private propertyKey?: string | symbol
    ) {

    }

    /**
     *
     * @param value
     * @returns {Metadata}
     */
    set = (value: T) =>
        Metadata.set(this.key, value, this.target, this.propertyKey);

    /**
     *
     */
    get = (): T =>
        Metadata.get(this.key, this.target, this.propertyKey);
    /**
     *
     */
    has = (): boolean =>
        Metadata.has(this.key, this.target, this.propertyKey);

    /**
     *
     * @param key
     * @param value
     * @param target
     * @param propertyKey
     */
    static set(key: string, value: any, target: any, propertyKey?: string | symbol): void {

        const targets = PROPERTIES.has(key) ? PROPERTIES.get(key) : [];
        const classConstructor = getClass(target);

        if (targets.indexOf(classConstructor) === -1) {
            targets.push(classConstructor);
            PROPERTIES.set(key, targets);
        }

        Reflect.defineMetadata(key, value, getClass(target), propertyKey);
    };


    /**
     *
     * @param key
     * @param target
     * @param propertyKey
     */
    static get = (key: string, target: any, propertyKey?: string | symbol): any =>
        Reflect.getMetadata(key, getClass(target), propertyKey);

    /**
     *
     * @param target
     * @param propertyKey
     */
    static getType = (target: any, propertyKey: string | symbol): any =>
        Reflect.getMetadata(DESIGN_TYPE, target, propertyKey) || [];

    /**
     *
     * @param target
     * @param propertyKey
     * @returns {any}
     */
    static getParamTypes(target: any, propertyKey?: string): any[] {
        return Reflect.getMetadata(DESIGN_PARAM_TYPES, target, propertyKey) || [];
    }
    /**
     *
     * @param key
     * @param target
     * @param targetKey
     */
    static has = (key: string, target: any, propertyKey?: string | symbol): boolean =>
        Reflect.hasMetadata(key, getClass(target), propertyKey);
    /**
     *
     * @param target
     * @param key
     */
    static delete = (target: any, key: string) =>
        Reflect.deleteMetadata(key, getClass(target));
    /**
     *
     * @param propertyKey
     */
    static getTargetsFromPropertyKey = (propertyKey: string) =>
        PROPERTIES.has(propertyKey) ? PROPERTIES.get(propertyKey) : [];

}