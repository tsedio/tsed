import {
  createExpressApplication,
  createHttpServer,
  createHttpsServer,
  createInjector,
  loadInjector,
  LocalsContainer,
  OnInit,
  ServerLoader
} from "@tsed/common";
import {Env, Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";

export class TestContext {
  private static _injector: InjectorService | null = null;

  static get injector(): InjectorService {
    if (this._injector) {
      return this._injector!;
    }

    /* istanbul ignore next */
    throw new Error(
      "TestContext.injector is not initialized. Use TestContext.create(): Promise before TestContext.invoke() or TestContext.injector.\n" +
        "Example:\n" +
        "before(async () => {\n" +
        "   await TestContext.create()\n" +
        "   await TestContext.invoke(MyService, [])\n" +
        "})"
    );
  }

  static async create() {
    TestContext._injector = TestContext.createInjector();

    await loadInjector(TestContext._injector);
  }

  /**
   * Create a new injector with the right default services
   */
  static createInjector(options: any = {}): InjectorService {
    const injector = createInjector(options);
    createExpressApplication(injector);
    createHttpServer(injector);
    createHttpsServer(injector);

    injector.settings.env = Env.TEST;

    return injector;
  }

  /**
   * Load the server silently without listening port and configure it on test profile.
   * @decorator
   * @param server
   * @param options
   * @returns {Promise<void>}
   */
  static bootstrap(server: ServerLoader | any, options: any = {}): () => Promise<void> {
    return async function before(): Promise<void> {
      const instance = await ServerLoader.bootstrap(server, {
        logger: {
          level: "off"
        },
        ...options
      });

      await instance.callHook("$beforeListen");
      await instance.callHook("$afterListen");
      await instance.ready();

      // used by inject method
      TestContext._injector = instance.injector;
    };
  }

  /**
   * Resets the test injector of the test context, so it won't pollute your next test. Call this in your `tearDown` logic.
   */
  static async reset() {
    if (TestContext._injector) {
      await TestContext._injector.destroy();
      TestContext._injector = null;
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
      if (!TestContext._injector) {
        await TestContext.create();
      }

      const injector: InjectorService = TestContext.injector;
      const deps = [];

      for (const target of targets) {
        deps.push(injector.has(target) ? injector.get(target) : await injector.invoke(target));
      }

      return await func(...deps);
    };
  }

  static invoke(target: Type<any>, providers: {provide: any | symbol; use: any}[]): any | Promise<any> {
    const locals = new LocalsContainer();
    providers.forEach(p => {
      locals.set(p.provide, p.use);
    });

    const instance: OnInit = TestContext.injector.invoke(target, locals, {rebuild: true});

    if (instance && instance.$onInit) {
      // await instance.$onInit();
      const result = instance.$onInit();
      if (result instanceof Promise) {
        return result.then(() => instance);
      }
    }

    return instance;
  }
}
