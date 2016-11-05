
import HashMap = require("hashmap");
require('reflect-metadata');

const PROPERTIES: HashMap<string, any[]> = new HashMap<string, any[]>();
/**
 *
 */
export default class Metadata<T>{

    constructor (
        private propertyKey: string,
        private target: any,
        private targetKey?: string | symbol
    ){

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
        const classConstructor = Metadata.getClass(target);

        if(targets.indexOf(classConstructor) === -1) {
            targets.push(classConstructor);
            PROPERTIES.set(propertyKey, targets);
        }

        Reflect.defineMetadata(propertyKey, value, Metadata.getClass(target), targetKey);
    };


    /**
     *
     * @param propertyKey
     * @param target
     * @param targetKey
     */
    static get = (propertyKey: string, target: any, targetKey?: string | symbol): any =>
        Reflect.getMetadata(propertyKey, Metadata.getClass(target), targetKey);

    /**
     *
     * @param propertyKey
     * @param target
     * @param targetKey
     */
    static has = (propertyKey: string, target: any, targetKey?: string | symbol): boolean =>
        Reflect.hasMetadata(propertyKey, Metadata.getClass(target), targetKey);

    static delete = (target: any, propertyKey: string) =>
        Reflect.deleteMetadata(propertyKey, Metadata.getClass(target));
    /**
     *
     * @param propertyKey
     */
    static getTargetsFromPropertyKey = (propertyKey: string) =>
        PROPERTIES.has(propertyKey) ? PROPERTIES.get(propertyKey) : [];

    /**
     *
     * @param target
     */
    static getClass = (target: any): any => target.prototype ? target : target.constructor;

}