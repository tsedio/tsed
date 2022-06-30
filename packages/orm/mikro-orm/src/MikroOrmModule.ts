import "./services/MikroOrmFactory";
import {Constant, Inject, Module, OnDestroy, OnInit, registerProvider} from "@tsed/di";
import {Options} from "@mikro-orm/core";
import {MikroOrmRegistry} from "./services/MikroOrmRegistry";
import {RetryStrategy} from "./services/RetryStrategy";
import {MikroOrmContextMiddleware} from "./middlewares/MikroOrmContextMiddleware";
import {OptimisticLockErrorFilter} from "./filters/OptimisticLockErrorFilter";

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
  responseFilters: [OptimisticLockErrorFilter],
  middlewares: [{hook: "$beforeRoutesInit", use: MikroOrmContextMiddleware}]
})
export class MikroOrmModule implements OnDestroy, OnInit {
  @Constant("mikroOrm", [])
  private readonly settings!: Options[];

  @Inject()
  private readonly mikroOrmRegistry!: MikroOrmRegistry;

  public async $onInit(): Promise<void> {
    const promises = this.settings.map((opts) => this.mikroOrmRegistry.register(opts));

    await Promise.all(promises);
  }

  public $onDestroy(): Promise<void> {
    return this.mikroOrmRegistry.clear();
  }
}

// TODO: the IoC container should provide null or undefined by default until tsedio/tsed#1694 is closed
registerProvider({provide: RetryStrategy, useValue: null});
