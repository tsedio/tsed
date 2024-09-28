import {EntityManager, RequestContext} from "@mikro-orm/core";
import {isFunction} from "@tsed/core";
import {Injectable} from "@tsed/di";

/**
 * @internal Since 2022-06-20.
 */
@Injectable()
export class MikroOrmContext {
  public run(managers: EntityManager[], task: (...args: unknown[]) => unknown): Promise<unknown> {
    // @ts-expect-error `RequestContext.createAsync` has been removed in favour of `RequestContext.create` since mikro-orm v6.0.0
    if (isFunction(RequestContext.createAsync)) {
      // @ts-expect-error see above
      return RequestContext.createAsync(managers, task);
    } else {
      return RequestContext.create(managers, task) as Promise<unknown>;
    }
  }

  public get(contextName?: string): EntityManager | undefined {
    return RequestContext.getEntityManager(contextName);
  }

  public has(contextName?: string): boolean {
    const manager = this.get(contextName);

    return !!manager;
  }
}
