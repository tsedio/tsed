import type {EndpointExtensionContext, HookExtensionContext, Item, OperationContext} from "@directus/types";
import {context, injectable} from "@tsed/di";

type DirectusContext = EndpointExtensionContext | OperationContext | HookExtensionContext;

/**
 * Service to manage and access Directus context within Ts.ED dependency injection container.
 *
 * This service provides a bridge between Directus extensions and Ts.ED's DI system,
 * allowing you to access the Directus context and its services from anywhere in your code.
 *
 * The context is automatically set by `wrapEndpoint`, `wrapOperation`, and `defineHook`
 * wrappers, making it available through the DI container.
 *
 * ### Accessing context in a custom service
 *
 * ```ts
 * import {Injectable} from "@tsed/di";
 * import {DirectusContextService} from "@tsed/directus-sdk";
 *
 * @Injectable()
 * export class MyService {
 *   directusContext = inject(DirectusContextService);
 *
 *   async doSomething() {
 *     const context = this.directusContext.get();
 *     const schema = await context.getSchema();
 *     // Use schema...
 *   }
 * }
 * ```
 *
 * ### Using inject() to get the service
 *
 * ```ts
 * import {inject} from "@tsed/di";
 * import {DirectusContextService} from "@tsed/directus-sdk";
 *
 * const contextService = inject(DirectusContextService);
 * const context = contextService.get();
 *```
 *
 * @remarks
 * This service is automatically registered as injectable and can be accessed via `inject()`.
 */
export class DirectusContextService {
  /**
   * Sets the Directus context in the current DI context.
   *
   * This method is typically called internally by the wrapper functions
   * (`wrapEndpoint`, `wrapOperation`, `defineHook`) and should not be
   * called manually in most cases.
   *
   * @param ctx - The Directus extension context (endpoint, operation, or hook)
   *
   * @example
   * ```ts
   * const contextService = inject(DirectusContextService);
   * contextService.set(directusContext);
   * ```
   */
  set(ctx: DirectusContext) {
    context().set("DIRECTUS_CONTEXT", ctx);
  }

  /**
   * Retrieves the Directus context from the current DI context.
   *
   * Returns the context that was previously set by the wrapper functions.
   * This allows you to access Directus services, schema, logger, and other
   * context-specific functionality.
   *
   * ### Accessing context properties
   *
   * ```ts
   * const contextService = inject(DirectusContextService);
   * const context = contextService.get();
   *
   * // Access logger
   * context.logger.info("Message");
   *
   * // Access schema
   * const schema = await context.getSchema();
   *
   * // Access services
   * const itemsService = new context.services.ItemsService("users");
   * ```
   *
   * @returns The Directus extension context, or undefined if not set
   *
   */
  get(): DirectusContext {
    return context().get("DIRECTUS_CONTEXT");
  }

  /**
   * Creates and returns an ItemsService instance for the specified collection.
   *
   * This is a convenience method that:
   *
   * 1. Retrieves the Directus context
   * 2. Fetches the database schema
   * 3. Creates an ItemsService with the schema and provided options
   *
   * The ItemsService allows you to perform CRUD operations on Directus collections.
   *
   * ### Basic usage
   *
   * ```ts
   * const contextService = inject(DirectusContextService);
   * const usersService = await contextService.getItemsService("users");
   *
   * // Read all users
   * const users = await usersService.readByQuery({ limit: -1 });
   *
   * // Create a user
   * const userId = await usersService.createOne({ name: "John", email: "john@example.com" });
   * ```
   *
   * ### With typed collection
   *
   * ```ts
   * type User = Item & {
   *   id: string;
   *   name: string;
   *   email: string;
   * };
   *
   * const contextService = inject(DirectusContextService);
   * const usersService = await contextService.getItemsService<User, "users">("users");
   *
   * // Now fully typed
   * const users: User[] = await usersService.readByQuery({ limit: -1 });
   * ```
   *
   * ### With accountability options
   *
   * ```ts
   * const contextService = inject(DirectusContextService);
   * const itemsService = await contextService.getItemsService("articles", {
   *   accountability: {
   *     user: "user-id",
   *     role: "admin"
   *   }
   * });
   * ```
   *
   * @template T - The item type extending Directus Item
   * @template Collection - The collection name as a string literal type
   * @param collection - The name of the collection to access
   * @param options - Additional options for the ItemsService (e.g., accountability, knex instance)
   * @returns A promise resolving to an ItemsService instance for the collection
   * @throws {Error} If no Directus context is available (called outside extension context)
   * @see {@link DirectusItemsRepository} for a more structured way to work with collections
   */
  async getItemsService<T extends Item = Item, Collection extends string = string>(collection: Collection, options: any = {}) {
    const context = this.get();

    if (context) {
      const schema = await context.getSchema();

      return new context.services.ItemsService<T, Collection>(collection, {
        ...options,
        schema
      });
    }

    throw new Error("No directus context available");
  }
}

injectable(DirectusContextService);
