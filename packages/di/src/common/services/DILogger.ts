import {injectable} from "../fn/injectable.js";
import {injector} from "../fn/injector.js";
import {DILogger} from "../interfaces/DILogger.js";

/**
 * Injection token for the DI logger service.
 *
 * Use this symbol to inject the configured logger instance into your services.
 *
 * ### Usage
 *
 * ```typescript
 * import {Injectable, Inject, LOGGER} from "@tsed/di";
 *
 * @Injectable()
 * class MyService {
 *   @Inject(LOGGER)
 *   logger: LOGGER;
 *
 *   doSomething() {
 *     this.logger.info("Doing something");
 *   }
 * }
 * ```
 *
 * @public
 */
export const LOGGER = Symbol.for("LOGGER");

/**
 * Type alias for the injected logger instance.
 *
 * @public
 */
export type LOGGER = DILogger;

injectable(LOGGER).factory(() => injector().logger);
