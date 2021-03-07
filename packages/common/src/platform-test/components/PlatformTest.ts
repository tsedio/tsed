import {Type} from "@tsed/core";
import {DITest, InjectorService} from "@tsed/di";
import {createInjector, loadInjector, PlatformBuilder, PlatformType} from "../../platform";
import {PlatformContext, RequestContextOptions} from "../../platform/domain/PlatformContext";
import {PlatformApplication} from "../../platform/services/PlatformApplication";
import {PlatformRequest} from "../../platform/services/PlatformRequest";
import {PlatformResponse} from "../../platform/services/PlatformResponse";

/**
 * @platform
 */
export class PlatformTest extends DITest {
  public static platformBuilder: Type<PlatformBuilder>;

  static async create(options: Partial<TsED.Configuration> = {}) {
    DITest.injector = PlatformTest.createInjector(options);

    await loadInjector(DITest.injector);
  }

  /**
   * Create a new injector with the right default services
   */
  static createInjector(settings: any = {}): InjectorService {
    return createInjector(DITest.configure(settings));
  }

  /**
   * Load the server silently without listening port and configure it on test profile.
   * @decorator
   * @param mod
   * @param options
   * @returns {Promise<void>}
   */
  static bootstrap(mod: any, settings: Partial<TsED.Configuration> = {}): () => Promise<void> {
    return async function before(): Promise<void> {
      let instance: any;
      const platform: PlatformType = settings.platform || PlatformTest.platformBuilder;

      /* istanbul ignore next */
      if (!platform) {
        throw new Error(
          "Platform type is not specified. Have you added at least `import @tsed/platform-express` (or equivalent) on your Server.ts ?"
        );
      }

      // @ts-ignore
      instance = await PlatformBuilder.build(platform).bootstrap(mod, DITest.configure(settings));

      await instance.callHook("$beforeListen");
      await instance.callHook("$afterListen");
      await instance.ready();

      // used by inject method
      DITest.injector = instance.injector;
    };
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
      if (!DITest.hasInjector()) {
        await PlatformTest.create();
      }

      const injector: InjectorService = DITest.injector;
      const deps = [];

      for (const target of targets) {
        deps.push(injector.has(target) ? injector.get(target) : await injector.invoke(target));
      }

      return await func(...deps);
    };
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
    return DITest.injector.get<PlatformApplication>(PlatformApplication)?.callback();
  }

  static createRequestContext(options: Partial<RequestContextOptions> = {}) {
    options.request = options.request || new PlatformRequest({} as any);
    options.response = options.response || new PlatformResponse({} as any);

    return new PlatformContext({
      id: "id",
      injector: DITest.injector,
      logger: DITest.injector.logger,
      url: "/",
      ...options
    });
  }
}
