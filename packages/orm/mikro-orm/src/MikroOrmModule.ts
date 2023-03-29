import "./services/MikroOrmFactory";
import {AlterRunInContext, Constant, Inject, InjectorService, Module, OnDestroy, OnInit, registerProvider} from "@tsed/di";
import {EventSubscriber, Options} from "@mikro-orm/core";
import {MikroOrmRegistry} from "./services/MikroOrmRegistry";
import {RetryStrategy} from "./services/RetryStrategy";
import {OptimisticLockErrorFilter} from "./filters/OptimisticLockErrorFilter";
import {MikroOrmContext} from "./services/MikroOrmContext";
import {isFunction} from "@tsed/core";

export type MikroOrmOptions = Omit<Options, "subscribers"> & {
  subscribers?: (EventSubscriber | (new (...args: unknown[]) => EventSubscriber))[];
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace TsED {
    interface Configuration {
      /**
       * The ORM configuration, entity metadata.
       * If you omit the `options` parameter, your CLI config will be used.
       */
      mikroOrm?: MikroOrmOptions[];
    }
  }
}

@Module({
  responseFilters: [OptimisticLockErrorFilter]
})
export class MikroOrmModule implements OnDestroy, OnInit, AlterRunInContext {
  @Constant("mikroOrm", [])
  private readonly settings!: MikroOrmOptions[];

  @Inject()
  private readonly registry!: MikroOrmRegistry;

  @Inject()
  private readonly context!: MikroOrmContext;

  @Inject()
  private readonly injector!: InjectorService;

  public async $onInit(): Promise<void> {
    await Promise.all(this.settings.map(async (opts) => this.registry.register(await this.prepareOptions(opts))));
  }

  public $onDestroy(): Promise<void> {
    return this.registry.clear();
  }

  public $alterRunInContext(next: (...args: unknown[]) => unknown): () => unknown | Promise<() => unknown> {
    return () => this.createContext(next);
  }

  private async prepareOptions(opts: MikroOrmOptions): Promise<Options> {
    const promises = opts.subscribers?.map((x) => (isFunction(x) ? this.injector.lazyInvoke(x) : x));

    return {
      ...opts,
      ...(promises ? {subscribers: await Promise.all(promises)} : {})
    };
  }

  private createContext(next: (...args: unknown[]) => unknown): unknown {
    const instances = [...this.registry.values()];
    const managers = instances.map((orm) => orm.em);

    return this.context.run(managers, next);
  }
}

// TODO: the IoC container should provide null or undefined by default until tsedio/tsed#1694 is closed
registerProvider({provide: RetryStrategy, useValue: null});
