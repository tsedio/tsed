import type {Type} from "@tsed/core/types/Type.js";
import {isArray} from "@tsed/core/utils/isArray.js";

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
      const instance = isArray(value)
        ? inj.getMany(value[0], {locals, parent: token})
        : inj.invoke(value, {
            locals,
            parent: token
          });

      list.push(instance);
    }
  }

  return list;
}

/**
 * Enable automatic dependency injection for a class constructor.
 *
 * Automatically resolves and injects constructor dependencies while preserving
 * the ability to manually pass arguments. Useful for classes that need both
 * automatic DI and manual instantiation flexibility.
 *
 * ### Usage
 *
 * ```typescript
 * import {AutoInjectable} from "@tsed/di";
 *
 * @AutoInjectable()
 * class UserService {
 *   constructor(
 *     private database: Database,     // Automatically injected
 *     private logger: Logger,         // Automatically injected
 *     customConfig?: Config           // Can be passed manually
 *   ) {}
 * }
 *
 * // Automatic injection
 * const service1 = new UserService();
 *
 * // Manual override
 * const service2 = new UserService(customDb, customLogger, {debug: true});
 *
 * // Partial override (remaining deps auto-injected)
 * const service3 = new UserService(undefined, undefined, {debug: true});
 * ```
 *
 * ### Behavior
 *
 * - Automatically resolves dependencies based on TypeScript metadata
 * - Manual arguments override automatic injection for that position
 * - `undefined` arguments trigger automatic injection
 *
 * @returns Class decorator function
 * @public
 * @decorator
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
