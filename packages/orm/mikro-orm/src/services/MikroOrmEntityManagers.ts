import {DIContext, Inject, Injectable, InjectContext} from "@tsed/di";
import {EntityManager} from "@mikro-orm/core";
import {Logger} from "@tsed/logger";

export interface EntityManagerCompat extends EntityManager {
  fork(clearOrForkOptions?: boolean | {clear?: boolean; useContext?: boolean}, useContext?: boolean): EntityManager;
}

/**
 * @internal Since 2022-06-20.
 */
@Injectable()
export class MikroOrmEntityManagers {
  private static readonly MIKRO_ORM_ENTITY_MANAGERS_KEY: unique symbol = Symbol("MIKRO_ORM_ENTITY_MANAGERS_KEY");

  @InjectContext()
  private context: DIContext | undefined;

  private get store(): Map<string, EntityManager> | undefined {
    return this.context?.get(MikroOrmEntityManagers.MIKRO_ORM_ENTITY_MANAGERS_KEY);
  }

  constructor(@Inject() private readonly logger: Logger) {}

  public set(em: EntityManager | EntityManager[]): this {
    const managers = Array.isArray(em) ? em : [em];

    if (this.context) {
      const forks = new Map(managers.map((em) => [em.name, this.fork(em)]));

      this.logger.debug("Forking the following entity managers: %s.", forks.keys());

      this.context.set(MikroOrmEntityManagers.MIKRO_ORM_ENTITY_MANAGERS_KEY, forks);
    }

    return this;
  }

  public get(contextName: string): EntityManager | undefined {
    return this.store?.get(contextName);
  }

  public has(contextName: string): boolean {
    return !!this.store?.has(contextName);
  }

  private fork(em: EntityManager): EntityManager {
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
    return (em as EntityManagerCompat).fork(
      {
        clear: true,
        useContext: true
      },
      true
    );
  }
}
