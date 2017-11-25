/**
 * @module common/mvc
 */
/** */
import {Metadata} from "../../core/class/Metadata";
import {Store} from "../../core/class/Store";
import {Type} from "../../core/interfaces/Type";
import {descriptorOf, getInheritedClass} from "../../core/utils";
import {EndpointMetadata} from "../class/EndpointMetadata";

/**
 * Registry for all Endpoint collected on a provide.
 */
export class EndpointRegistry {
    /**
     * Retrieve all endpoints from inherited class and store it in the registry.
     * @param {Type<any>} ctrlClass
     */
    static inherit(ctrlClass: Type<any>) {
        let inheritedClass = getInheritedClass(ctrlClass);

        while (inheritedClass && EndpointRegistry.hasEndpoints(inheritedClass)) {

            this.getEndpoints(inheritedClass)
                .forEach((endpointInheritedClass: EndpointMetadata) => {
                    const endpoint = endpointInheritedClass.inherit(ctrlClass);

                    EndpointRegistry
                        .getEndpoints(ctrlClass)
                        .push(endpoint);
                });

            inheritedClass = getInheritedClass(inheritedClass);
        }
    }

    /**
     * Get endpoints by his target.
     * @param {Type<any>} target
     * @returns {EndpointMetadata[]}
     */
    static getEndpoints(target: Type<any>): EndpointMetadata[] {
        if (!this.hasEndpoints(target)) {
            Metadata.set(EndpointRegistry.name, [], target);
        }
        return Metadata.getOwn(EndpointRegistry.name, target);
    }

    /**
     * Gets a value indicating whether the target object or its prototype chain has endpoints.
     * @param {Type<any>} target
     * @returns {boolean}
     */
    static hasEndpoints(target: Type<any>) {
        return Metadata.hasOwn(EndpointRegistry.name, target);
    }

    /**
     * Get an endpoint.
     * @param target
     * @param method
     */
    static get(target: Type<any>, method: string): EndpointMetadata {
        if (!this.has(target, method)) {
            const endpoint = new EndpointMetadata(target, method);
            EndpointRegistry.getEndpoints(target).push(endpoint);
            Metadata.set(EndpointRegistry.name, endpoint, target, method);
        }

        return Metadata.getOwn(EndpointRegistry.name, target, method);
    }

    /**
     * Gets a value indicating whether the target object or its prototype chain has already method registered.
     * @param target
     * @param method
     */
    static has(target: Type<any>, method: string): boolean {
        return Metadata.hasOwn(EndpointRegistry.name, target, method);
    }

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
     * Store a data on store manager.
     * @param targetClass
     * @param methodClassName
     * @returns {any}
     */
    static store(targetClass: any, methodClassName: string): Store {
        return Store.from(targetClass, methodClassName, descriptorOf(targetClass, methodClassName));
    }
}
