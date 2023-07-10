import "./services/MikroOrmFactory";
import {AlterRunInContext, Constant, Inject, Module, OnDestroy, OnInit, registerProvider} from "@tsed/di";
import {EventSubscriber, Options} from "@mikro-orm/core";
import {MikroOrmRegistry} from "./services/MikroOrmRegistry";
import {RetryStrategy} from "./services/RetryStrategy";
import {OptimisticLockErrorFilter} from "./filters/OptimisticLockErrorFilter";
import {MikroOrmContext} from "./services/MikroOrmContext";
import {classOf, Store} from "@tsed/core";
import {DEFAULT_CONTEXT_NAME, SUBSCRIBER_INJECTION_TYPE} from "./constants";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace TsED {
    interface Configuration {
      /**
       * The ORM configuration, entity metadata.
       * If you omit the `options` parameter, your CLI config will be used.
       */
      mikroOrm?: Options[];
    }
  }
}

@Module({
  responseFilters: [OptimisticLockErrorFilter]
})
export class MikroOrmModule implements OnDestroy, OnInit, AlterRunInContext {
  @Constant("mikroOrm", [])
  private readonly settings!: Options[];

  @Inject()
  private readonly registry!: MikroOrmRegistry;

  @Inject()
  private readonly context!: MikroOrmContext;

  constructor(@Inject(SUBSCRIBER_INJECTION_TYPE) private subscribers: EventSubscriber[]) {}

  public async $onInit(): Promise<void> {
    await Promise.all(
      this.settings.map(async (opts) =>
        this.registry.register({
          ...opts,
          subscribers: [...(opts.subscribers ?? []), ...this.getSubscribers(opts.contextName)]
        })
      )
    );
  }

  public $onDestroy(): Promise<void> {
    return this.registry.clear();
  }

  public $alterRunInContext(next: (...args: unknown[]) => unknown): () => unknown | Promise<() => unknown> {
    return () => this.createContext(next);
  }

  private getSubscribers(contextName: string = DEFAULT_CONTEXT_NAME): EventSubscriber[] {
    return this.subscribers.filter((instance) => Store.from(classOf(instance)).get(SUBSCRIBER_INJECTION_TYPE)?.contextName === contextName);
  }

  private createContext(next: (...args: unknown[]) => unknown): unknown {
    const instances = [...this.registry.values()];
    const managers = instances.map((orm) => orm.em);

    return this.context.run(managers, next);
  }
}

// TODO: the IoC container should provide null or undefined by default until tsedio/tsed#1694 is closed
registerProvider({provide: RetryStrategy, useValue: null});
