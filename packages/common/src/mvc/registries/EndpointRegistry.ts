import {descriptorOf, getInheritedClass, Metadata, Store, Type} from "@tsed/core";
import {EndpointMetadata} from "../models/EndpointMetadata";

/**
 * Registry for all Endpoint collected on a provide.
 */
export class EndpointRegistry {
  /**
   * Return all endpoints from the given class. This method doesn't return the endpoints from the parent of the given class.
   * @param {Type<any>} target
   * @returns {any}
   */
  static getOwnEndpoints(target: Type<any>) {
    if (!this.hasEndpoints(target)) {
      Metadata.set("endpoints", [], target);
    }

    return Metadata.getOwn("endpoints", target);
  }

  /**
   * Get all endpoints from a given class and his parents.
   * @param {Type<any>} target
   * @returns {EndpointMetadata[]}
   */
  static getEndpoints(target: Type<any>): EndpointMetadata[] {
    return this.getOwnEndpoints(target).concat(this.inherit(target));
  }

  /**
   * Gets a value indicating whether the target object or its prototype chain has endpoints.
   * @param {Type<any>} target
   * @returns {boolean}
   */
  static hasEndpoints(target: Type<any>) {
    return Metadata.hasOwn("endpoints", target);
  }

  /**
   * Get an endpoint.
   * @param target
   * @param propertyKey
   */
  static get(target: Type<any>, propertyKey: string | symbol): EndpointMetadata {
    if (!this.has(target, propertyKey)) {
      const endpoint = new EndpointMetadata({target, propertyKey});
      this.getOwnEndpoints(target).push(endpoint);
      Metadata.set("endpoints", endpoint, target, propertyKey);
    }

    return Metadata.getOwn("endpoints", target, propertyKey);
  }

  /**
   * Gets a value indicating whether the target object or its prototype chain has already method registered.
   * @param target
   * @param method
   */
  static has(target: Type<any>, method: string | symbol): boolean {
    return Metadata.hasOwn("endpoints", target, method);
  }

  /**
   * Append mvc in the pool (before).
   * @param target
   * @param targetKey
   * @param args
   */
  static useBefore(target: Type<any>, targetKey: string | symbol, args: any[]) {
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
  static use(target: Type<any>, targetKey: string | symbol, args: any[]) {
    this.get(target, targetKey).merge(args);

    return this;
  }

  /**
   * Append mvc in the pool (after).
   * @param target
   * @param targetKey
   * @param args
   */
  static useAfter(target: Type<any>, targetKey: string | symbol, args: any[]) {
    this.get(target, targetKey).after(args);

    return this;
  }

  /**
   * Store a data on store manager.
   * @param target
   * @param propertyKey
   * @returns {any}
   */
  static store(target: any, propertyKey: string): Store {
    return Store.from(target, propertyKey, descriptorOf(target, propertyKey));
  }

  /**
   * Retrieve all endpoints from inherited class and store it in the registry.
   * @param {Type<any>} ctrlClass
   */
  private static inherit(ctrlClass: Type<any>) {
    const endpoints: EndpointMetadata[] = [];
    let inheritedClass = getInheritedClass(ctrlClass);

    while (inheritedClass && EndpointRegistry.hasEndpoints(inheritedClass)) {
      this.getOwnEndpoints(inheritedClass).forEach((endpointInheritedClass: EndpointMetadata) => {
        const endpoint = endpointInheritedClass.inherit(ctrlClass);

        endpoints.push(endpoint);
      });

      inheritedClass = getInheritedClass(inheritedClass);
    }

    return endpoints;
  }
}
