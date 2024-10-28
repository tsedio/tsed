import "./services/MikroOrmFactory.js";

import {EventSubscriber, Options} from "@mikro-orm/core";
import {classOf, isFunction, Store} from "@tsed/core";
import {
  AlterRunInContext,
  Constant,
  Inject,
  InjectorService,
  LocalsContainer,
  Module,
  OnDestroy,
  OnInit,
  ProviderScope,
  registerProvider
} from "@tsed/di";

import {DEFAULT_CONTEXT_NAME, SUBSCRIBER_INJECTION_TYPE} from "./constants.js";
import {OptimisticLockErrorFilter} from "./filters/OptimisticLockErrorFilter.js";
import {RetryStrategy} from "./interfaces/RetryStrategy.js";
import {MikroOrmContext} from "./services/MikroOrmContext.js";
import {MikroOrmRegistry} from "./services/MikroOrmRegistry.js";

declare global {
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

  @Inject()
  private readonly injector!: InjectorService;

  constructor(@Inject(SUBSCRIBER_INJECTION_TYPE) private subscribers: EventSubscriber[]) {}

  public async $onInit(): Promise<void> {
    const container = new LocalsContainer();

    await Promise.all(this.settings.map((opts) => this.registry.register({...opts, subscribers: this.getSubscribers(opts, container)})));
  }

  public $onDestroy(): Promise<void> {
    return this.registry.clear();
  }

  public $alterRunInContext(next: (...args: unknown[]) => unknown): () => unknown | Promise<() => unknown> {
    return () => this.createContext(next);
  }

  private getSubscribers(opts: Pick<Options, "subscribers" | "contextName">, container: LocalsContainer) {
    return [...this.getUnmanagedSubscribers(opts, container), ...this.getManagedSubscribers(opts.contextName)];
  }

  private getUnmanagedSubscribers(opts: Pick<Options, "subscribers">, container: LocalsContainer) {
    const diOpts = {scope: ProviderScope.INSTANCE};

    return (opts.subscribers ?? []).map((subscriber) => {
      // Starting from https://github.com/mikro-orm/mikro-orm/issues/4231 mikro-orm
      // accept also accepts class reference, not just instances.
      if (isFunction(subscriber)) {
        return this.injector.invoke(subscriber, container, diOpts);
      }

      return subscriber;
    });
  }

  private getManagedSubscribers(contextName: string = DEFAULT_CONTEXT_NAME): EventSubscriber[] {
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
