import {TokenProvider} from "../interfaces/TokenProvider.js";
import {Provider} from "./Provider.js";
import {ProviderType} from "./ProviderType.js";

/**
 * Middleware configuration for a controller.
 *
 * Defines middleware tokens to be applied at different stages of request processing.
 *
 * @public
 */
export interface ControllerMiddlewares {
  useBefore: TokenProvider[];
  use: TokenProvider[];
  useAfter: TokenProvider[];
}

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
 */
export class ControllerProvider<T = any> extends Provider<T> {
  public tokenRouter: string;

  constructor(token: TokenProvider, options: Partial<Provider> = {}) {
    super(token, options);
    this.type = ProviderType.CONTROLLER;
  }

  /**
   *
   * @returns {any[]}
   */
  get middlewares(): Partial<ControllerMiddlewares> {
    return Object.assign(
      {
        use: [],
        useAfter: [],
        useBefore: []
      },
      this.store.get("middlewares", {})
    );
  }

  /**
   *
   * @param middlewares
   */
  set middlewares(middlewares: Partial<ControllerMiddlewares>) {
    const mdlwrs = this.middlewares;
    const concat = (key: string, a: any, b: any) => (a[key] = a[key].concat(b[key]));

    Object.keys(middlewares).forEach((key: string) => {
      concat(key, mdlwrs, middlewares);
    });

    this.store.set("middlewares", mdlwrs);
  }
}
