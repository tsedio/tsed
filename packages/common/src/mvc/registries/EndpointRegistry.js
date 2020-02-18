"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const EndpointMetadata_1 = require("../models/EndpointMetadata");
/**
 * Registry for all Endpoint collected on a provide.
 */
class EndpointRegistry {
    /**
     * Return all endpoints from the given class. This method doesn't return the endpoints from the parent of the given class.
     * @param {Type<any>} target
     * @returns {any}
     */
    static getOwnEndpoints(target) {
        if (!this.hasEndpoints(target)) {
            core_1.Metadata.set("endpoints", [], target);
        }
        return core_1.Metadata.getOwn("endpoints", target);
    }
    /**
     * Get all endpoints from a given class and his parents.
     * @param {Type<any>} target
     * @returns {EndpointMetadata[]}
     */
    static getEndpoints(target) {
        return this.getOwnEndpoints(target).concat(this.inherit(target));
    }
    /**
     * Gets a value indicating whether the target object or its prototype chain has endpoints.
     * @param {Type<any>} target
     * @returns {boolean}
     */
    static hasEndpoints(target) {
        return core_1.Metadata.hasOwn("endpoints", target);
    }
    /**
     * Get an endpoint.
     * @param target
     * @param propertyKey
     */
    static get(target, propertyKey) {
        if (!this.has(target, propertyKey)) {
            const endpoint = new EndpointMetadata_1.EndpointMetadata({ target, propertyKey });
            this.getOwnEndpoints(target).push(endpoint);
            core_1.Metadata.set("endpoints", endpoint, target, propertyKey);
        }
        return core_1.Metadata.getOwn("endpoints", target, propertyKey);
    }
    /**
     * Gets a value indicating whether the target object or its prototype chain has already method registered.
     * @param target
     * @param method
     */
    static has(target, method) {
        return core_1.Metadata.hasOwn("endpoints", target, method);
    }
    /**
     * Append mvc in the pool (before).
     * @param target
     * @param targetKey
     * @param args
     */
    static useBefore(target, targetKey, args) {
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
    static use(target, targetKey, args) {
        this.get(target, targetKey).merge(args);
        return this;
    }
    /**
     * Append mvc in the pool (after).
     * @param target
     * @param targetKey
     * @param args
     */
    static useAfter(target, targetKey, args) {
        this.get(target, targetKey).after(args);
        return this;
    }
    /**
     * Store a data on store manager.
     * @param target
     * @param propertyKey
     * @returns {any}
     */
    static store(target, propertyKey) {
        return core_1.Store.from(target, propertyKey, core_1.descriptorOf(target, propertyKey));
    }
    /**
     * Retrieve all endpoints from inherited class and store it in the registry.
     * @param {Type<any>} ctrlClass
     */
    static inherit(ctrlClass) {
        const endpoints = [];
        let inheritedClass = core_1.getInheritedClass(ctrlClass);
        while (inheritedClass && EndpointRegistry.hasEndpoints(inheritedClass)) {
            this.getOwnEndpoints(inheritedClass).forEach((endpoint) => {
                endpoints.push(inheritEndpoint(ctrlClass, endpoint));
            });
            inheritedClass = core_1.getInheritedClass(inheritedClass);
        }
        return endpoints;
    }
}
exports.EndpointRegistry = EndpointRegistry;
function inheritEndpoint(target, endpoint) {
    return new EndpointMetadata_1.EndpointMetadata(Object.assign(Object.assign({}, endpoint), { target, type: endpoint.type, parent: endpoint }));
}
//# sourceMappingURL=EndpointRegistry.js.map