import {EventSubscriber, MetadataStorage, Options} from "@mikro-orm/core";
import {isClass, isFunction, Type} from "@tsed/core";
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
import {instance} from "ts-mockito";
import {OptimisticLockErrorFilter} from "./filters/OptimisticLockErrorFilter";
import {MikroOrmContext} from "./services/MikroOrmContext";
import "./services/MikroOrmFactory";
import {MikroOrmRegistry} from "./services/MikroOrmRegistry";
import {RetryStrategy} from "./services/RetryStrategy";

export interface MikroOrmOptions extends Omit<Options, "subscribers"> {
  subscribers?: (EventSubscriber | Type<EventSubscriber>)[];
}

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
  private readonly injector: InjectorService;

  public async $onInit(): Promise<void> {
    const subscribers = MetadataStorage.getSubscriberMetadata();
    const container = new LocalsContainer();
    const diOpts = {scope: ProviderScope.INSTANCE};

    Object.values(subscribers).forEach((instance) => {
      // try to make all subscribers decorated with @Subscriber to be injectable (in this case,
      this.injector.bindInjectableProperties(instance, container, diOpts);
    });

    await Promise.all(
      this.settings.map(async (opts) => {
        opts.subscribers = opts.subscribers ?? [];

        const subscribers = opts.subscribers.map((subscriber) => {
          if (isFunction(subscriber)) {
            return this.injector.invoke(subscriber, container, diOpts);
          }

          this.injector.bindInjectableProperties(instance, container, diOpts);

          return subscriber;
        });

        return this.registry.register({
          ...opts,
          subscribers
        });
      })
    );
  }

  public $onDestroy(): Promise<void> {
    return this.registry.clear();
  }

  public $alterRunInContext(next: (...args: unknown[]) => unknown): () => unknown | Promise<() => unknown> {
    return () => this.createContext(next);
  }

  private createContext(next: (...args: unknown[]) => unknown): unknown {
    const instances = [...this.registry.values()];
    const managers = instances.map((orm) => orm.em);

    return this.context.run(managers, next);
  }
}

// TODO: the IoC container should provide null or undefined by default until tsedio/tsed#1694 is closed
registerProvider({provide: RetryStrategy, useValue: null});
