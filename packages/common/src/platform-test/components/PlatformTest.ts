import {Env, Type} from "@tsed/core";
import {InjectorService, LocalsContainer, OnInit, TokenProvider} from "@tsed/di";
import {createInjector, loadInjector, PlatformBuilder} from "../../platform-builder";
import {RequestContext, RequestContextOptions} from "../../platform/domain/RequestContext";
import {PlatformApplication} from "../../platform/services/PlatformApplication";

export interface PlatformTestInvokeOptions {
  token?: TokenProvider;
  use: any;
}

export class PlatformTest {
  public static platformBuilder: Type<PlatformBuilder>;
  protected static _injector: InjectorService | null = null;

  static get injector(): InjectorService {
    if (this._injector) {
      return this._injector!;
    }

    /* istanbul ignore next */
    throw new Error(
      "PlatformTest.injector is not initialized. Use PlatformTest.create(): Promise before PlatformTest.invoke() or PlatformTest.injector.\n" +
        "Example:\n" +
        "before(async () => {\n" +
        "   await PlatformTest.create()\n" +
        "   await PlatformTest.invoke(MyService, [])\n" +
        "})"
    );
  }

  static async create(options: Partial<TsED.Configuration> = {}) {
    PlatformTest._injector = PlatformTest.createInjector(options);

    await loadInjector(PlatformTest._injector);
  }

  /**
   * Create a new injector with the right default services
   */
  static createInjector(options: any = {}): InjectorService {
    const injector = createInjector(options);

    injector.settings.env = Env.TEST;

    return injector;
  }

  /**
   * Load the server silently without listening port and configure it on test profile.
   * @decorator
   * @param mod
   * @param options
   * @returns {Promise<void>}
   */
  static bootstrap(mod: any, options: Partial<TsED.Configuration> = {}): () => Promise<void> {
    return async function before(): Promise<void> {
      let instance: any;
      PlatformTest.platformBuilder = options.platform || PlatformTest.platformBuilder;

      /* istanbul ignore next */
      if (!PlatformTest.platformBuilder) {
        throw new Error(
          "Platform type is not specified. Have you added at least `import @tsed/platform-express` (or equivalent) on your Server.ts ?"
        );
      }

      // @ts-ignore
      instance = await PlatformBuilder.build(PlatformTest.platformBuilder).bootstrap(mod, {
        logger: {
          level: "off"
        },
        ...options
      });

      await instance.callHook("$beforeListen");
      await instance.callHook("$afterListen");
      await instance.ready();

      // used by inject method
      PlatformTest._injector = instance.injector;
    };
  }

  /**
   * Resets the test injector of the test context, so it won't pollute your next test. Call this in your `tearDown` logic.
   */
  static async reset() {
    if (PlatformTest._injector) {
      await PlatformTest._injector.destroy();
      PlatformTest._injector = null;
    }
  }

  /**
   * It injects services into the test function where you can alter, spy on, and manipulate them.
   *
   * The inject function has two parameters
   *
   * * an array of Service dependency injection tokens,
   * * a test function whose parameters correspond exactly to each item in the injection token array.
   *
   * @param targets
   * @param func
   */
  static inject<T>(targets: any[], func: (...args: any[]) => Promise<T> | T): () => Promise<T> {
    return async (): Promise<T> => {
      if (!PlatformTest._injector) {
        await PlatformTest.create();
      }

      const injector: InjectorService = PlatformTest.injector;
      const deps = [];

      for (const target of targets) {
        deps.push(injector.has(target) ? injector.get(target) : await injector.invoke(target));
      }

      return await func(...deps);
    };
  }

  /**
   * Invoke a provider and return a fresh instance
   * @param target
   * @param providers
   */
  static invoke<T = any>(target: TokenProvider, providers: PlatformTestInvokeOptions[] = []): T | Promise<T> {
    const locals = new LocalsContainer();
    providers.forEach(p => {
      locals.set(p.token, p.use);
    });

    const instance: OnInit = PlatformTest.injector.invoke(target, locals, {rebuild: true});

    if (instance && instance.$onInit) {
      // await instance.$onInit();
      const result = instance.$onInit();
      if (result instanceof Promise) {
        return result.then(() => instance as any);
      }
    }

    return instance as any;
  }

  /**
   * Return the instance from injector registry
   * @param target
   * @param options
   */
  static get<T = any>(target: TokenProvider, options: any = {}): T {
    return PlatformTest.injector.get<T>(target, options)!;
  }

  /**
   * Return the raw application (express or koa).
   * Use this callback with SuperTest.
   *
   * ```typescript
   * let request: SuperTest.SuperTest<SuperTest.Test>;
   * beforeEach(PlatformTest.bootstrap(Server, {
   *   mount: {
   *     "/rest": [ProductsController]
   *   }
   * }));
   * beforeEach(() => {
   *   request = SuperTest(PlatformTest.callback());
   * });
   * ```
   */
  static callback() {
    return PlatformTest.injector.get<PlatformApplication>(PlatformApplication)?.callback();
  }

  static createRequestContext(options: Partial<RequestContextOptions> = {}) {
    return new RequestContext({
      id: "id",
      logger: this.injector.logger,
      url: "/",
      ...options
    });
  }
}
