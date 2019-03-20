import {createExpressApplication, createHttpServer, createHttpsServer, createInjector, ServerLoader} from "@tsed/common";
import {Env, Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {$log} from "ts-log-debug";

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
    const injector = await TestContext.createInjector();

    TestContext._injector = injector;

    await TestContext.injector.load();
  }

  /**
   * Create a new injector with the right default services
   */
  static async createInjector(options: any = {}): Promise<InjectorService> {
    const injector = await createInjector(options);
    await createExpressApplication(injector);
    await createHttpServer(injector);
    await createHttpsServer(injector);

    injector.settings.env = Env.TEST;

    // const hasExpress = injector.has(ExpressApplication);
    //
    // if (!hasExpress) {
    //   createExpressApplication(injector);
    // }
    //
    // if (!injector.has(HttpServer)) {
    //   createHttpServer(injector);
    // }
    //
    // if (!injector.has(HttpsServer)) {
    //   createHttpsServer(injector);
    // }
    //
    // if (!hasExpress) {
    //   injector.get<ServerSettingsService>(ServerSettingsService)!.env = Env.TEST;
    // }

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
    $log.stop();

    return async function before(): Promise<void> {
      const instance = new (server as any)(...(options.args || []));

      await instance.init();

      instance.startServers = () => Promise.resolve();

      // used by inject method
      TestContext._injector = instance.injector;

      await instance.start();
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

  static async invoke(target: Type<any>, providers: {provide: any | symbol; use: any}[]): Promise<any> {
    const locals = new Map();
    providers.forEach(p => {
      locals.set(p.provide, p.use);
    });

    const instance: any = await TestContext.injector.invoke(target, locals, {rebuild: true});

    if (instance && instance.$onInit) {
      await instance.$onInit();
    }

    return instance;
  }
}
