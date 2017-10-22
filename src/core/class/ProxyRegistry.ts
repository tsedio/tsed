/**
 * @module common/core
 */
/** */
import {Type} from "../interfaces/Type";
import {Registry} from "./Registry";

export abstract class ProxyRegistry<T, I> {

    constructor(protected registry: Registry<T, I>) {

    }

    // abstract invoke<T>(target: any, locals?: Map<Function, any>, designParamTypes?: any[]): T;
    /**
     *
     * @param callbackfn
     * @param thisArg
     */
    public forEach = (callbackfn: (value: T, index: any, map: Map<any, any>) => void, thisArg?: any): void =>
        this.registry.forEach(callbackfn, thisArg);

    /**
     *
     * @param target
     * @returns {ControllerProvider}
     */
    public get(target: Type<any> | symbol): T | undefined {
        return this.registry.get(target);
    }

    /**
     *
     * @param target
     * @param provider
     */
    public set(target: Type<any> | symbol, provider: I) {
        this.registry.merge(target, provider);
        return this;
    }

    /**
     *
     * @param target
     */
    public has(target: Type<any> | symbol): boolean {
        return this.registry.has(target);
    }

    /**
     *
     * @returns {number}
     */
    get size() {
        return this.registry.size;
    }
}