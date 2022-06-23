import "./services/MikroOrmFactory";
import {Constant, Inject, Module, OnDestroy, OnInit, registerProvider} from "@tsed/di";
import {Options} from "@mikro-orm/core";
import {MikroOrmRegistry} from "./services/MikroOrmRegistry";
import {RetryStrategy} from "./services/RetryStrategy";
import {OptimisticLockErrorFilter} from "./filters/OptimisticLockErrorFilter";
import {BeforeRoutesInit, Next, PlatformApplication, Req, Res} from "@tsed/common";
import {MikroOrmContext} from "./services/MikroOrmContext";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace TsED {
    interface Configuration {
      /**
       * The the ORM configuration, entity metadata.
       * If you omit the `options` parameter, your CLI config will be used.
       */
      mikroOrm?: Options[];
    }
  }
}

@Module({
  responseFilters: [OptimisticLockErrorFilter]
})
export class MikroOrmModule implements OnDestroy, OnInit, BeforeRoutesInit {
  @Constant("mikroOrm", [])
  private readonly settings!: Options[];

  @Inject()
  private readonly registry!: MikroOrmRegistry;

  @Inject()
  private readonly context!: MikroOrmContext;

  @Inject()
  private readonly app: PlatformApplication;

  public async $onInit(): Promise<void> {
    const promises = this.settings.map((opts) => this.registry.register(opts));

    await Promise.all(promises);
  }

  public $onDestroy(): Promise<void> {
    return this.registry.clear();
  }

  public $beforeRoutesInit(): void {
    /**
     * Use a raw middleware to create an async context,
     * since {@link PlatformHandler} is losing a context created by {@link RequestContext}.
     * For details see https://github.com/tsedio/tsed/issues/1289
     */
    this.app.use((req: Req, res: Res, next: Next) => this.createContext(next));
  }

  private createContext(next: Next): unknown {
    const instances = [...this.registry.values()];
    const managers = instances.map((orm) => orm.em);

    return this.context.run(managers, next as any);
  }
}

// TODO: the IoC container should provide null or undefined by default until tsedio/tsed#1694 is closed
registerProvider({provide: RetryStrategy, useValue: null});
