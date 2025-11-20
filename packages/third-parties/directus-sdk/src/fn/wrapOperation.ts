import "../bootstrap/runtime.js";

import type {OperationContext} from "@directus/types";
import {DIContext, inject, injector, runInContext} from "@tsed/di";
import {nanoid} from "nanoid";

import {DirectusContextService} from "../services/DirectusContextService.js";

/**
 * Wraps an operation handler to provide Ts.ED dependency injection and error handling.
 *
 * This function is internally used by `defineOperationApi` to:
 * - Initialize the Ts.ED DI container for each operation execution
 * - Enable service injection via `inject()` within the operation handler
 * - Provide automatic error handling and logging
 * - Set up the Directus context in `DirectusContextService`
 * - Create an isolated DI context for each operation run
 *
 * Each operation execution runs within its own DI context with platform set to
 * `DIRECTUS_OPERATION`, ensuring proper isolation between different operation runs.
 *
 * @template Options - Type definition for the operation's configuration options
 *
 * @param callback - The operation handler function that receives options and context
 *
 * @returns A wrapped handler that integrates with Directus flows and Ts.ED
 *
 * @remarks
 * This is typically used internally by `defineOperationApi`. You generally don't need
 * to call this directly unless you're building custom operation wrappers.
 *
 * Error handling:
 * - Errors are caught and logged with structured information
 * - Error details include name, message, description, and stack trace
 * - Logger is automatically flushed after error logging
 * - The error is not re-thrown, allowing the flow to continue
 *
 * @see {@link defineOperationApi} for the recommended way to create operations
 * @see {@link DirectusContextService} to access Directus context in injected services
 */
export function wrapOperation<Options = Record<string, unknown>>(
  callback: (options: Options, context: OperationContext) => unknown | Promise<unknown> | void
) {
  return async (options: Options, context: OperationContext) => {
    await injector().load();

    const $ctx = new DIContext({
      id: nanoid(),
      platform: "DIRECTUS_OPERATION",
      maxStackSize: 0
    });

    return runInContext($ctx, async () => {
      try {
        inject(DirectusContextService).set(context);

        return await callback(options, context);
      } catch (error: any) {
        $ctx.logger.error({
          error_name: error.name,
          error_message: error.message,
          error_description: error.description,
          error_stack: error.stack
        });
      } finally {
        $ctx.logger.flush();
      }
    });
  };
}
