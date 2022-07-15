import {Injectable} from "@tsed/di";
import {EntityManager, RequestContext} from "@mikro-orm/core";

/**
 * @internal Since 2022-06-20.
 */
@Injectable()
export class MikroOrmContext {
  public run(managers: EntityManager[], task: (...args: unknown[]) => unknown): Promise<unknown> {
    return RequestContext.createAsync(managers, task as any);
  }

  public get(contextName?: string): EntityManager | undefined {
    return RequestContext.getEntityManager(contextName);
  }

  public has(contextName?: string): boolean {
    const manager = this.get(contextName);

    return !!manager;
  }
}
