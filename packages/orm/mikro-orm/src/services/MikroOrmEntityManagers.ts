import {DIContext, getAsyncStore, Inject, Injectable} from "@tsed/di";
import {EntityManager} from "@mikro-orm/core";
import {AsyncLocalStorage} from "async_hooks";
import {Logger} from "@tsed/logger";

export interface EntityManagerCompat extends EntityManager {
  fork(clearOrForkOptions?: boolean | {clear?: boolean; useContext?: boolean}, useContext?: boolean): EntityManager;
}

@Injectable()
/**
 * @internal Since 2022-06-20.
 */
export class MikroOrmEntityManagers {
  private static readonly MIKRO_ORM_ENTITY_MANAGERS_KEY: unique symbol = Symbol("MIKRO_ORM_ENTITY_MANAGERS_KEY");
  private readonly storage: AsyncLocalStorage<DIContext>;

  private get context(): DIContext | undefined {
    return this.storage.getStore();
  }

  constructor(@Inject() private readonly logger: Logger) {
    if (AsyncLocalStorage) {
      this.storage = getAsyncStore();
    } else {
      throw new Error(`AsyncLocalStorage is not available for your Node.js version (${process.versions.node}).`);
    }
  }

  public entries(): Map<string, EntityManager> | undefined {
    return this.context?.get(MikroOrmEntityManagers.MIKRO_ORM_ENTITY_MANAGERS_KEY);
  }

  public set(em: EntityManager | EntityManager[]): this {
    const managers = Array.isArray(em) ? em : [em];

    if (this.context) {
      /**
       * The fork method signature has been changed since v5.x,
       * which might lead to unexpected behavior while using the @Transactional() decorator.
       *
       * ```diff
       * - fork(clear = true, useContext = false): D[typeof EntityManagerType]
       * + fork(options: ForkOptions = {}): D[typeof EntityManagerType] {
       * ```
       *
       * To ensure backward compatibility with v4.x and add support for v5.x, provided the following workaround:
       */
      const forks = new Map(managers.map((em) => [em.name, (em as EntityManagerCompat).fork({clear: true, useContext: true}, true)]));

      this.logger.debug("Forking the following entity managers: %s.", forks.keys());

      this.context.set(MikroOrmEntityManagers.MIKRO_ORM_ENTITY_MANAGERS_KEY, forks);
    } else {
      this.logger.debug("Cannot fork the following entity managers due to lack of async context.");
    }

    return this;
  }

  public get(contextName: string): EntityManager | undefined {
    const entries = this.entries();

    return entries?.get(contextName);
  }

  public has(contextName: string): boolean {
    const entries = this.entries();

    return !!entries?.has(contextName);
  }
}
