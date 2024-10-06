import {Type} from "@tsed/core";
import {DITest, InjectorService} from "@tsed/di";
import accepts from "accepts";
import type {IncomingMessage, RequestListener, ServerResponse} from "http";

import {PlatformBuilder} from "../builder/PlatformBuilder.js";
import {PlatformContext, PlatformContextOptions} from "../domain/PlatformContext.js";
import {createInjector} from "../utils/createInjector.js";
import {getConfiguration} from "../utils/getConfiguration.js";
import {FakeResponse} from "./FakeResponse.js";
import {PlatformAdapter, PlatformBuilderSettings} from "./PlatformAdapter.js";
import {PlatformApplication} from "./PlatformApplication.js";

/**
 * @platform
 */
export class PlatformTest extends DITest {
  public static adapter: Type<PlatformAdapter>;

  static async create(settings: Partial<TsED.Configuration> = {}) {
    DITest.injector = PlatformTest.createInjector(getConfiguration(settings));
    await DITest.createContainer();
  }

  /**
   * Create a new injector with the right default services
   */
  static createInjector(settings: any = {}): InjectorService {
    return createInjector({
      settings: DITest.configure({httpPort: false, httpsPort: false, ...settings})
    });
  }

  /**
   * Load the server silently without listening port and configure it on test profile.
   * @decorator
   * @param mod
   * @param listen
   * @param settings
   * @returns {Promise<void>}
   */
  static bootstrap(mod: any, {listen, ...settings}: Partial<PlatformBuilderSettings & {listen: boolean}> = {}): () => Promise<void> {
    return async function before(): Promise<void> {
      let instance: PlatformBuilder;
      const adapter: Type<PlatformAdapter> = settings.platform || settings.adapter || PlatformTest.adapter;

      /* istanbul ignore next */
      if (!adapter) {
        throw new Error(
          "Platform adapter is not specified. Have you added at least `import @tsed/platform-express` (or equivalent) on your Server.ts ?"
        );
      }

      // @ts-ignore
      settings = DITest.configure(settings);
      settings.adapter = adapter as any;

      const configuration = getConfiguration(settings, mod);
      const disableComponentsScan = configuration.disableComponentsScan || !!process.env.WEBPACK;

      if (!disableComponentsScan) {
        const {importProviders} = await import("@tsed/components-scan");
        await importProviders(configuration);
      }

      instance = await PlatformBuilder.build(mod, configuration).bootstrap();
      await instance.listen(!!listen);

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

      return func(...deps);
    };
  }

  /**
   * Return the raw application (express or koa).
   * Use this callback with SuperTest.
   *
   * ```typescript
   * let request: SuperTest.Agent;
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
  static callback(): RequestListener<typeof IncomingMessage, typeof ServerResponse> {
    return DITest.injector.get<PlatformApplication>(PlatformApplication)?.callback() as any;
  }

  static createRequest(options: any = {}): any {
    return {
      headers: {},
      method: "GET",
      url: "/",
      query: {},
      get(key: string) {
        return this.headers[key.toLowerCase()];
      },
      accepts(mime?: string | string[]) {
        return accepts(this).types([].concat(mime as never));
      },
      ...options
    };
  }

  static createResponse(options: any = {}): any {
    return new FakeResponse(options);
  }

  static createRequestContext(options: Partial<PlatformContextOptions & any> = {}) {
    const event = {
      ...options.event,
      request: options?.request?.request || options?.event?.request || PlatformTest.createRequest(),
      response: options?.response?.response || options?.event?.response || PlatformTest.createResponse()
    };

    const $ctx = new PlatformContext({
      id: "id",
      injector: DITest.injector,
      logger: DITest.injector.logger,
      url: "/",
      ...options,
      event
    });

    if (options.endpoint) {
      $ctx.endpoint = options.endpoint;
    }

    return $ctx;
  }
}
