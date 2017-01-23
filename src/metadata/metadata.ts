import {DESIGN_TYPE, DESIGN_PARAM_TYPES} from "../constants/metadata-keys";
import {getClass} from "../utils/utils";
require("reflect-metadata");

const PROPERTIES: Map<string, any[]> = new Map<string, any[]>();
/**
 *
 */
export default class Metadata<T>{

    constructor (
        private propertyKey: string,
        private target: any,
        private targetKey?: string | symbol
    ) {

    }

    /**
     *
     * @param value
     * @returns {Metadata}
     */
    set = (value: T) =>
        Metadata.set(this.propertyKey, value, this.target, this.targetKey);

    /**
     *
     */
    get = (): T =>
        Metadata.get(this.propertyKey, this.target, this.targetKey);
    /**
     *
     */
    has = (): boolean =>
        Metadata.has(this.propertyKey, this.target, this.targetKey);

    /**
     *
     * @param propertyKey
     * @param value
     * @param target
     * @param targetKey
     */
    static set(propertyKey: string, value: any, target: any, targetKey?: string | symbol): void {

        const targets = PROPERTIES.has(propertyKey) ? PROPERTIES.get(propertyKey) : [];
        const classConstructor = getClass(target);

        if (targets.indexOf(classConstructor) === -1) {
            targets.push(classConstructor);
            PROPERTIES.set(propertyKey, targets);
        }

        Reflect.defineMetadata(propertyKey, value, getClass(target), targetKey);
    };


    /**
     *
     * @param propertyKey
     * @param target
     * @param targetKey
     */
    static get = (propertyKey: string, target: any, targetKey?: string | symbol): any =>
        Reflect.getMetadata(propertyKey, getClass(target), targetKey);

    /**
     *
     * @param target
     * @param targetKey
     */
    static getType = (target: any, targetKey: string | symbol): any =>
        Reflect.getMetadata(DESIGN_TYPE, target, targetKey);

    /**
     *
     * @param target
     * @param propertyKey
     * @returns {any}
     */
    static getParamTypes(target: any, propertyKey: string): any[] {
        return Reflect.getMetadata(DESIGN_PARAM_TYPES, target, propertyKey);
    }
    /**
     *
     * @param propertyKey
     * @param target
     * @param targetKey
     */
    static has = (propertyKey: string, target: any, targetKey?: string | symbol): boolean =>
        Reflect.hasMetadata(propertyKey, getClass(target), targetKey);

    static delete = (target: any, propertyKey: string) =>
        Reflect.deleteMetadata(propertyKey, getClass(target));
    /**
     *
     * @param propertyKey
     */
    static getTargetsFromPropertyKey = (propertyKey: string) =>
        PROPERTIES.has(propertyKey) ? PROPERTIES.get(propertyKey) : [];

}