/**
 * @module mvc
 */
/** */
import {EndpointMetadata} from "./EndpointMetadata";
import {EndpointRegistry} from "../registries/EndpointRegistry";
import {Type} from "../../core/interfaces/Type";


/**
 * Endpoint is proxy of EndpointMetadata and EndpointRegistry.
 */
export class Endpoint extends EndpointMetadata {

    /**
     *
     * @param target
     * @param method
     */
    static get(target: Type<any>, method: string): EndpointMetadata {
        return EndpointRegistry.get(target, method);
    }

    /**
     *
     * @param target
     * @param method
     */
    static has = (target: Type<any>, method: string): boolean =>
        EndpointRegistry.has(target, method);

    /**
     * Append mvc in the pool (before).
     * @param target
     * @param method
     * @param args
     */
    static useBefore = (target: Type<any>, method: string, args: any[]) =>
        EndpointRegistry.useBefore(target, method, args);

    /**
     * Add middleware and configuration for the endpoint.
     * @param target
     * @param method
     * @param args
     * @returns {Endpoint}
     */
    static use = (target: Type<any>, method: string, args: any[]) =>
        EndpointRegistry.use(target, method, args);

    /**
     * Append mvc in the pool (after).
     * @param target
     * @param method
     * @param args
     */
    static useAfter = (target: Type<any>, method: string, args: any[]) =>
        EndpointRegistry.use(target, method, args);

    /**
     * Store value for an endpoint method.
     * @param key
     * @param value
     * @param targetClass
     * @param methodClassName
     */
    static setMetadata = (key: any, value: any, targetClass: any, methodClassName: any) =>
        EndpointRegistry.setMetadata(key, value, targetClass, methodClassName);

    /**
     * Return the stored value for an endpoint method.
     * @param key
     * @param targetClass
     * @param methodClassName
     */
    static getMetadata = (key: any, targetClass: any, methodClassName: any) =>
        EndpointRegistry.getMetadata(key, targetClass, methodClassName);
}
