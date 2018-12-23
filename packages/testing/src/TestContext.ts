import {$log} from "ts-log-debug";
import {InjectorService} from "@tsed/di";
import {
  createExpressApplication,
  createHttpServer,
  createHttpsServer,
  createInjector,
  ExpressApplication,
  HttpServer,
  HttpsServer,
  ServerLoader,
  ServerSettingsService
} from "@tsed/common";
import {Env, Type} from "@tsed/core";

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

    await TestContext.injector.load();
  }

  /**
   * Create a new injector with the right default services
   */
  static createInjector(options: any = {}): InjectorService {
    const injector = createInjector(options);
    const hasExpress = injector.has(ExpressApplication);

    if (!hasExpress) {
      createExpressApplication(injector);
    }

    if (!injector.has(HttpServer)) {
      createHttpServer(injector);
    }

    if (!injector.has(HttpsServer)) {
      createHttpsServer(injector, {port: 8081});
    }

    if (!hasExpress) {
      injector.get<ServerSettingsService>(ServerSettingsService)!.env = Env.TEST;
    }

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

      instance.startServers = () => Promise.resolve();

      // used by inject method
      TestContext._injector = instance.injector;

      await instance.start();
    };
  }

  /**
   * Resets the test injector of the test context, so it won't pollute your next test. Call this in your `tearDown` logic.
   */
  static reset() {
    if (TestContext._injector) {
      TestContext._injector.clear();
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
      const args = targets.map(target => (injector.has(target) ? injector.get(target) : injector.invoke(target)));
      const result = await func(...args);

      return result;
    };
  }

  static invoke(target: Type<any>, providers: {provide: any | symbol; use: any}[]) {
    const locals = new Map();

    providers.forEach(p => {
      locals.set(p.provide, p.use);
    });

    return TestContext.injector.invoke(target, locals);
  }
}
