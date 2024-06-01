import {uniq} from "./uniq.js";

/**
 * @ignore
 */
export type ProxyDelegationGetter<T = any> = (target: T, property: PropertyKey) => any | undefined;
/**
 * @ignore
 */
export type ProxyDelegationRemove<T = any> = (target: T, property: PropertyKey) => any;
/**
 * @ignore
 */
export type ProxyDelegationSetter<T = any> = (target: T, property: PropertyKey, value: any, receiver: any) => any;
/**
 * @ignore
 */
export type ProxyDelegationOwnKeys<T = any> = (target: T) => (string | symbol)[];

/**
 * @ignore
 */
export interface ProxyDelegation<T extends object> {
  handlers?: ProxyHandler<T>;
  getter?: ProxyDelegationGetter<T>;
  setter?: ProxyDelegationSetter<T>;
  remove?: ProxyDelegationRemove<T>;
  ownKeys?: ProxyDelegationOwnKeys<T>;
}

/**
 * Create a complete and iterable trap.
 * @param self
 * @param options
 * @ignore
 */
export function proxyDelegation<T extends object = any>(self: any, options: ProxyDelegation<T> = {}) {
  const {handlers = {}, remove, ownKeys} = options;
  const get: ProxyDelegationGetter = options.getter || ((target: any, propertyKey: PropertyKey) => target.get(propertyKey));
  const set: ProxyDelegationSetter =
    options.setter || ((target: any, propertyKey: PropertyKey, value: any) => !!target.set(propertyKey, value));

  const itsOwnProp = (target: any, p: PropertyKey) => Reflect.has(target, p) || typeof p === "symbol";

  return new Proxy<T>(self, {
    getOwnPropertyDescriptor(target: any, p: PropertyKey): PropertyDescriptor | undefined {
      return Reflect.getOwnPropertyDescriptor(target, p);
    },

    has(target: any, p: PropertyKey): boolean {
      if (itsOwnProp(target, p)) {
        return Reflect.has(target, p);
      }

      return get(target, p) !== undefined;
    },

    get(target: any, p: PropertyKey, receiver: any): any {
      if (itsOwnProp(target, p)) {
        return Reflect.get(target, p, receiver);
      }

      return get(target, p);
    },

    set(target: any, p: PropertyKey, value: any, receiver: any): boolean {
      if (itsOwnProp(target, p)) {
        return Reflect.set(target, p, value, receiver);
      }

      return !!set(target, p as any, value, receiver);
    },

    deleteProperty(target: any, p: PropertyKey): boolean {
      if (itsOwnProp(target, p) || !remove) {
        return Reflect.deleteProperty(target, p);
      }

      return remove(target, p);
    },

    defineProperty(target: any, p: PropertyKey, attributes: PropertyDescriptor): boolean {
      return Reflect.defineProperty(target, p, attributes);
    },

    ownKeys(target: any) {
      return uniq(Reflect.ownKeys(target).concat((ownKeys && ownKeys(target)) || []));
    },
    ...handlers
  });
}
