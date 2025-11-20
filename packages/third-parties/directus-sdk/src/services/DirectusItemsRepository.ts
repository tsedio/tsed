import type {Item, MutationOptions} from "@directus/types";
import {inject} from "@tsed/di";

import {DirectusContextService} from "./DirectusContextService.js";

/**
 * Abstract base class for creating typed repository patterns with Directus collections.
 *
 * This class provides a structured way to interact with Directus collections by:
 * - Automatically retrieving the Directus context via dependency injection
 * - Providing common CRUD operations (create, update, listAll)
 * - Supporting custom methods through inheritance
 * - Ensuring type safety with TypeScript generics
 *
 * Extend this class to create collection-specific repositories with custom business logic.
 *
 * ### Basic repository with custom methods
 * ```ts
 * import {injectable} from "@tsed/di";
 * import {DirectusItemsRepository} from "@tsed/directus-sdk";
 * import type {Item} from "@directus/types";
 *
 * type Release = Item & {
 *   id: string;
 *   title: string;
 *   status: "draft" | "published";
 *   publishedAt?: string;
 * };
 *
 * export class ReleasesRepository extends DirectusItemsRepository<Release, "releases"> {
 *   protected collection = "releases" as const;
 *
 *   async getPublishedReleases() {
 *     const collection = await this.getCollection();
 *
 *     return collection.readByQuery({
 *       filter: {
 *         status: {
 *           _eq: "published"
 *         }
 *       },
 *       sort: ["-publishedAt"]
 *     });
 *   }
 *
 *   async publishRelease(id: string) {
 *     return this.update({
 *       id,
 *       status: "published",
 *       publishedAt: new Date().toISOString()
 *     });
 *   }
 * }
 * injectable(ReleasesRepository)
 * ```
 *
 * ### Repository with complex queries
 *
 * ```ts
 * import {injectable} from "@tsed/di";
 * import {DirectusItemsRepository} from "@tsed/directus-sdk";
 *
 * export class ArticlesRepository extends DirectusItemsRepository<Article, "articles"> {
 *   protected collection = "articles" as const;
 *
 *   async findByAuthor(authorId: string) {
 *     const collection = await this.getCollection();
 *
 *     return collection.readByQuery({
 *       filter: {
 *         author: {
 *           _eq: authorId
 *         }
 *       }
 *     });
 *   }
 *
 *   async searchByTitle(query: string) {
 *     const collection = await this.getCollection();
 *
 *     return collection.readByQuery({
 *       filter: {
 *         title: {
 *           _contains: query
 *         }
 *       }
 *     });
 *   }
 * }
 * injectable(ArticlesRepository);
 * ```
 *
 * ### Using repository in an endpoint
 *
 * ```ts
 * import {defineEndpoint} from "@tsed/directus-sdk";
 * import {inject} from "@tsed/di";
 *
 * export default defineEndpoint({
 *   id: "releases-api",
 *   handler: (router) => {
 *     const releasesRepo = inject(ReleasesRepository);
 *
 *     router.get("/releases", async (req, res) => {
 *       const releases = await releasesRepo.getPublishedReleases();
 *       res.json(releases);
 *     });
 *
 *     router.post("/releases/:id/publish", async (req, res) => {
 *       const release = await releasesRepo.publishRelease(req.params.id);
 *       res.json(release);
 *     });
 *   }
 * });
 * ```
 *
 * @template T - The item type extending Directus Item interface
 * @template Collection - The collection name as a string literal type
 *
 * @remarks
 * - The extending class must define the `collection` property
 * - Don't forget to mark the extending class with `@Injectable()` or `injectable()`
 * - Access to Directus context is automatically handled through `DirectusContextService`
 *
 * @see {@link DirectusContextService} for lower-level access to Directus context
 */
export abstract class DirectusItemsRepository<T extends Item = Item, Collection extends string = string> {
  protected contextService = inject(DirectusContextService);
  protected abstract collection: Collection;

  /**
   * Retrieves the Directus ItemsService for the configured collection.
   *
   * This method provides access to the underlying Directus ItemsService,
   * which offers full CRUD capabilities and advanced query features.
   *
   * ```ts
   * const collection = await this.getCollection();
   * const items = await collection.readByQuery({
   *   filter: { status: { _eq: "active" } },
   *   limit: 10,
   *   offset: 0
   * });
   * ```
   *
   * @returns A promise resolving to the ItemsService for the collection
   *
   */
  getCollection() {
    return this.contextService.getItemsService<T, Collection>(this.collection as Collection);
  }

  /**
   * Creates a new item in the collection and returns the created item.
   *
   * ```ts
   * const newRelease = await releasesRepo.create({
   *   title: "Version 1.0",
   *   status: "draft"
   * });
   *
   * console.log(newRelease.id); // Auto-generated ID
   * ```
   *
   * ### With mutation options
   *
   * ```ts
   * const item = await repo.create(data, {
   *   emitEvents: false,
   *   bypassLimits: true
   * });
   * ```
   *
   * @param data - Partial item data to create
   * @param opts - Optional mutation options (e.g., emitEvents, bypassLimits)
   *
   * @returns A promise resolving to the created item with all fields
   */
  async create(data: Partial<T>, opts?: MutationOptions): Promise<T> {
    const collection = await this.getCollection();
    const key = await collection.createOne(data, opts);

    return collection.readOne(key);
  }

  /**
   * Updates an existing item in the collection and returns the updated item.
   *
   * ```ts
   * const updated = await releasesRepo.update({
   *   id: "release-123",
   *   status: "published"
   * });
   * ```
   *
   * ### With mutation options
   *
   * ```ts
   * const updated = await repo.update(
   *   { id: "123", title: "New Title" },
   *   { emitEvents: true }
   * );
   * ```
   *
   * @param data - Partial item data including the required `id` field
   * @param opts - Optional mutation options (e.g., emitEvents, bypassLimits)
   *
   * @returns A promise resolving to the updated item
   */
  async update(data: Partial<T> & Pick<T, "id">, opts?: MutationOptions): Promise<T> {
    const collection = await this.getCollection();
    const key = await collection.updateOne(data.id, data, opts);

    return collection.readOne(key);
  }

  /**
   * Retrieves all items from the collection without pagination.
   *
   * ```ts
   * const allReleases = await releasesRepo.listAll();
   * console.log(`Total releases: ${allReleases.length}`);
   * ```
   *
   * ### For large collections, consider custom pagination
   *
   * ```ts
   * async getPaginatedItems(page: number, pageSize: number) {
   *   const collection = await this.getCollection();
   *   return collection.readByQuery({
   *     limit: pageSize,
   *     offset: (page - 1) * pageSize
   *   });
   * }
   * ```
   *
   * @returns A promise resolving to an array of all items in the collection
   *
   * @remarks
   * This method uses `limit: -1` to retrieve all items. Use with caution on
   * large collections as it may impact performance.
   *
   */
  async listAll(): Promise<T[]> {
    const service = await this.getCollection();

    return (await service.readByQuery({limit: -1})) as unknown as T[];
  }
}
