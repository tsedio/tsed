import {Provider} from "./Provider.js";

/**
 * Specialized provider for HTTP controllers.
 *
 * Extends the base `Provider` class with controller-specific metadata like middleware configuration
 * and routing information. Used internally to manage HTTP route controllers in the DI system.
 *
 * ### Usage
 *
 * ```typescript
 * import {ControllerProvider} from "@tsed/di";
 *
 * const provider = new ControllerProvider(MyController);
 * provider.middlewares = {
 *   useBefore: [AuthMiddleware],
 *   use: [ValidationMiddleware],
 *   useAfter: [LoggingMiddleware]
 * };
 * ```
 *
 * @typeParam T - The type of controller class
 * @public
 * @deprecated Use Provider instead.
 */
export const ControllerProvider = Provider;
