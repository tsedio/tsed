/**
 * @module mvc
 */
/** */
import {Metadata} from "../../core/class/Metadata";
import {Type} from "../../core/interfaces/Type";
import {nameOf} from "../../core/utils/index";
import {EndpointMetadata} from "../class/EndpointMetadata";
/**
 * Registry for all Endpoint collected on a provide.
 */
export class EndpointRegistry {

    static getByTarget(target): EndpointMetadata[] {
        if (!Metadata.has(EndpointRegistry.name, target)) {
            Metadata.set(EndpointRegistry.name, [], target);
        }
        return Metadata.get(EndpointRegistry.name, target);
    }
    /**
     *
     * @param target
     * @param method
     */
    static get(target: Type<any>, method: string): EndpointMetadata {
        if (!this.has(target, method)) {
            const endpoint = new EndpointMetadata(target, method);
            EndpointRegistry.getByTarget(target).push(endpoint);
            Metadata.set(EndpointRegistry.name, endpoint, target, method);
        }

        return Metadata.get(EndpointRegistry.name, target, method);
    }

    /**
     *
     * @param target
     * @param method
     */
    static has = (target: Type<any>, method: string): boolean =>
        Metadata.has(EndpointRegistry.name, target, method);

    /**
     * Append mvc in the pool (before).
     * @param target
     * @param targetKey
     * @param args
     */
    static useBefore(target: Type<any>, targetKey: string, args: any[]) {
        this.get(target, targetKey).before(args);
        return this;
    }

    /**
     * Add middleware and configuration for the endpoint.
     * @param target
     * @param targetKey
     * @param args
     * @returns {Endpoint}
     */
    static use(target: Type<any>, targetKey: string, args: any[]) {
        this.get(target, targetKey).merge(args);
        return this;
    }

    /**
     * Append mvc in the pool (after).
     * @param target
     * @param targetKey
     * @param args
     */
    static useAfter(target: Type<any>, targetKey: string, args: any[]) {
        this.get(target, targetKey).after(args);
        return this;
    }

    /**
     * Store value for an endpoint method.
     * @param key
     * @param value
     * @param targetClass
     * @param methodClassName
     */
    static setMetadata = (key: any, value: any, targetClass: any, methodClassName: any) =>
        Metadata.set(nameOf(key), value, targetClass, methodClassName);

    /**
     * Return the stored value for an endpoint method.
     * @param key
     * @param targetClass
     * @param methodClassName
     */
    static getMetadata = (key: any, targetClass: any, methodClassName: any) =>
        Metadata.get(nameOf(key), targetClass, methodClassName);
}
