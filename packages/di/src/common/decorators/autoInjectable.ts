import {isArray, type Type} from "@tsed/core";

import {LocalsContainer} from "../domain/LocalsContainer.js";
import {injector} from "../fn/injector.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";
import {getConstructorDependencies} from "../utils/getConstructorDependencies.js";

function resolveAutoInjectableArgs(token: Type, args: unknown[]) {
  const inj = injector();
  const locals = new LocalsContainer();
  const deps: TokenProvider[] = getConstructorDependencies(token);
  const list: any[] = [];
  const length = Math.max(deps.length, args.length);

  for (let i = 0; i < length; i++) {
    if (args[i] !== undefined) {
      list.push(args[i]);
    } else {
      const value = deps[i];
      const instance = isArray(value) ? inj.getMany(value[0], {locals, parent: token}) : inj.invoke(value, {locals, parent: token});

      list.push(instance);
    }
  }

  return list;
}

/**
 * AutoInjectable decorator is used to automatically inject dependencies in the constructor.
 *
 * @example
 * ```typescript
 * @AutoInjectable()
 * class UserService {
 *   constructor(
 *     private database: Database,  // automatically injected
 *     customConfig?: Config        // can be passed manually
 *   ) {}
 * }
 * ```
 *
 * @description
 * When applied to a class, this decorator:
 * - Automatically resolves and injects dependencies based on constructor parameter types
 * - Preserves the ability to manually pass arguments which override automatic injection
 *
 * @decorator
 * @returns {ClassDecorator} A class decorator that enables automatic dependency injection
 */
export function AutoInjectable() {
  return <T extends {new (...args: any[]): NonNullable<unknown>}>(constr: T): T => {
    return class AutoInjectable extends constr {
      constructor(...args: any[]) {
        super(...resolveAutoInjectableArgs(constr, args));
      }
    } as unknown as T;
  };
}
