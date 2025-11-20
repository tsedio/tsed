import "../bootstrap/runtime.js";

import type {EndpointExtensionContext} from "@directus/types";
import {attachLogger, DIContext, inject, injector, runInContext} from "@tsed/di";
import type {Router} from "express";
import {nanoid} from "nanoid";

import {DirectusContextService} from "../services/DirectusContextService.js";

const VERBS = ["get", "put", "post", "delete", "head", "use", "all", "options"];

/**
 * Wraps an endpoint handler to provide Ts.ED dependency injection and error handling.
 *
 * This function is internally used by `defineEndpoint` to:
 * - Initialize the Ts.ED DI container for each request
 * - Wrap all Express router methods (GET, POST, PUT, DELETE, etc.)
 * - Provide automatic error handling with proper HTTP responses
 * - Attach Directus logger to the DI context
 * - Log errors with structured error information
 *
 * Each route handler executes within its own DI context, allowing proper isolation
 * and service injection via `inject()`.
 *
 * @param callback - The endpoint handler function that receives router and context
 *
 * @returns A wrapped handler that integrates with Directus and Ts.ED
 *
 * @remarks
 * This is typically used internally by `defineEndpoint`. You generally don't need to
 * call this directly unless you're building custom endpoint wrappers.
 *
 * Error handling:
 * - Errors are caught and returned as JSON responses
 * - Status code is extracted from `error.status` (defaults to 500)
 * - Error message is extracted from `error.error_message` or `error.message`
 * - Additional errors array is included if present in `error.errors`
 * - All errors are logged with structured information (name, message, description, stack)
 *
 * @see {@link defineEndpoint} for the recommended way to create endpoints
 * @see {@link DirectusContextService} to access Directus context in injected services
 */
export function wrapEndpoint(callback: (router: Router, context: EndpointExtensionContext) => void) {
  return (router: Router, context: EndpointExtensionContext) => {
    attachLogger(context.logger);

    VERBS.forEach((verb) => {
      const r: any = router;
      if (r[verb] && !r["__" + verb]) {
        r["__" + verb] = r[verb];

        r[verb] = (path: string, handler: any) => {
          const wrapped = async (req: any, res: any) => {
            await injector().load();

            const $ctx = new DIContext({
              id: nanoid(),
              platform: "DIRECTUS_ENDPOINT",
              maxStackSize: 0
            });

            return runInContext($ctx, async () => {
              inject(DirectusContextService).set(context);

              try {
                return await handler(req, res);
              } catch (error: any) {
                res.status(error.status || 500).json({
                  message: error.error_message || error.message || "Internal Server Error",
                  errors: error.errors
                });

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

          r["__" + verb](path, wrapped);
        };
      }
    });

    callback(router, context);
  };
}
