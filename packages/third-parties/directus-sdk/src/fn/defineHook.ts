import "../bootstrap/runtime.js";

import type {HookExtensionContext, RegisterFunctions} from "@directus/types";
import {DIContext, inject, injector, runInContext} from "@tsed/di";
import {nanoid} from "nanoid";

import {DirectusContextService} from "../services/DirectusContextService.js";

/**
 * Defines a Directus hook with Ts.ED dependency injection support.
 *
 * This function wraps your hook callback to provide:
 * - Automatic Ts.ED DI container initialization
 * - Service injection via `inject()` function
 * - Proper error handling and logging
 * - Access to Directus context through `DirectusContextService`
 *
 * Hooks allow you to trigger custom logic when certain events occur in Directus,
 * such as when items are created, updated, or deleted.
 *
 * ### Basic hook with filters
 *
 * ```ts
 * import {defineHook} from "@tsed/directus-sdk";
 * import {inject} from "@tsed/di";
 *
 * export default defineHook(({filter, action}) => {
 *   const validationService = inject(ValidationService);
 *
 *   // Filter runs before the event (can modify data or cancel operation)
 *   filter("items.create", async (payload, meta) => {
 *     await validationService.validate(payload);
 *     return payload;
 *   });
 *
 *   // Action runs after the event (cannot modify data)
 *   action("items.create", async (meta) => {
 *     console.log("Item created:", meta.key);
 *   });
 * });
 * ```
 *
 * ### Hook with service injection and multiple events
 *
 * ```ts
 * import {defineHook} from "@tsed/directus-sdk";
 * import {inject} from "@tsed/di";
 * import {logger} from "@tsed/logger";
 *
 * export default defineHook(({filter, action}) => {
 *   const productService = inject(ProductService);
 *   const notificationService = inject(NotificationService);
 *
 *   logger().info("Product hooks loaded");
 *
 *   // Ensure unique product rankings on create
 *   filter("product_rankings.items.create", async (payload) => {
 *     return productService.ensureUniqueRanking(payload);
 *   });
 *
 *   // Ensure unique product rankings on update
 *   filter("product_rankings.items.update", async (payload) => {
 *     return productService.ensureUniqueRanking(payload);
 *   });
 *
 *   // Send notification when product is published
 *   action("products.items.update", async (meta, context) => {
 *     if (context.payload.status === "published") {
 *       await notificationService.sendPublishedNotification(meta.key);
 *     }
 *   });
 *
 *   // Return services for debugging/testing
 *   return {
 *     productService,
 *     notificationService
 *   };
 * });
 * ```
 *
 * ### Hook with init and schedule
 *
 * ```ts
 * import {defineHook} from "@tsed/directus-sdk";
 * import {inject} from "@tsed/di";
 *
 * export default defineHook(({init, schedule}) => {
 *   const cacheService = inject(CacheService);
 *   const syncService = inject(SyncService);
 *
 *   // Run once when Directus starts
 *   init("app.before", async () => {
 *     await cacheService.warmup();
 *   });
 *
 *   // Run on a schedule (cron syntax)
 *   schedule("0 * * * *", async () => {
 *     await syncService.hourlySync();
 *   });
 * });
 * ```
 *
 * @param callback - The hook initialization function that receives:
 *   - `register` - Functions to register event handlers (filter, action, init, schedule, embed)
 *   - `context` - The Directus hook extension context
 *
 * @returns A wrapped hook function ready to be exported from your extension file
 * @see {@link DirectusContextService} to access Directus context within injected services
 * @see {@link https://docs.directus.io/extensions/hooks.html} Directus Hooks Documentation
 */
export function defineHook(callback: (register: RegisterFunctions, context: HookExtensionContext) => unknown | Promise<unknown> | void) {
  return async (register: RegisterFunctions, context: HookExtensionContext) => {
    await injector().load();

    const $ctx = new DIContext({
      id: nanoid(),
      platform: "DIRECTUS_HOOK",
      maxStackSize: 0
    });

    return runInContext($ctx, async () => {
      try {
        inject(DirectusContextService).set(context);

        return await callback(register, context);
      } catch (error: any) {
        $ctx.logger.error({
          error_name: error.name,
          error_message: error.message,
          error_description: error.description,
          error_stack: error.stack
        });
        throw error;
      } finally {
        $ctx.logger.flush();
      }
    });
  };
}
