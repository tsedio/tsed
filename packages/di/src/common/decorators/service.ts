import {Injectable} from "./injectable.js";

/**
 * Declare a service class that can be injected into other components.
 *
 * Alias for `@Injectable()` decorator with default settings.
 * Services are singleton-scoped and instantiated once during application startup.
 *
 * ### Usage
 *
 * ```typescript
 * import {Service} from "@tsed/di";
 *
 * @Service()
 * export class UserService {
 *   async findById(id: string) {
 *     // Service logic
 *   }
 * }
 *
 * // Use in another service or controller
 * @Service()
 * export class AuthService {
 *   constructor(private userService: UserService) {}
 * }
 * ```
 *
 * @returns Class decorator function
 * @public
 * @decorator
 */
export function Service(): Function {
  return Injectable();
}
