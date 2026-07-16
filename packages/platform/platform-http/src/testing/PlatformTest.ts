import {DITest, injector, InjectorService} from "@tsed/di";
import type {IncomingMessage, RequestListener, ServerResponse} from "node:http";
import {isPlainObject} from "@tsed/core";
import {PlatformAdapter, PlatformBuilderSettings} from "../common/services/PlatformAdapter.js";
import {FakeAdapter} from "./FakeAdapter.js";
import {FakeResponse} from "./FakeResponse.js";
import {adapter} from "../common/fn/adapter.js";
import {defineConfiguration} from "../common/config/defineConfiguration.js";
import {PlatformContext, PlatformContextOptions} from "../common/domain/PlatformContext.js";
import {PlatformApplication} from "../common/services/PlatformApplication.js";
import {PlatformBuilder} from "../common/builder/PlatformBuilder.js";
import accepts from "accepts";
import {createInjector} from "../common/utils/createInjector.js";

/**
 * @platform
 */
export class PlatformTest extends DITest {
  static async create(settings: Partial<TsED.Configuration> = {}) {
    settings.imports = [
      {
        token: PlatformAdapter,
        useClass: FakeAdapter
      },
      ...(settings.imports || [])
    ];

    PlatformTest.createInjector(defineConfiguration(DITest.configure(settings)));

    await DITest.createContainer();
  }

  /**
   * Create a new injector with the right default services
   */
  static createInjector(settings: Partial<TsED.Configuration> = {}): InjectorService {
    return createInjector(settings);
  }

  /**
   * Load the server silently without listening port and configure it on test profile.
   *
   * @returns {Promise<void>}
   */
  static bootstrap(settings?: Partial<PlatformBuilderSettings & {listen: boolean}>): () => Promise<void>;
  static bootstrap(mod: any, settings?: Partial<PlatformBuilderSettings & {listen: boolean}>): () => Promise<void>;
  static bootstrap(
    mod: any,
    initialSettings: Partial<
      PlatformBuilderSettings & {
        listen: boolean;
      }
    > = {}
  ): () => Promise<void> {
    if (!isPlainObject(mod)) {
      initialSettings.rootModule = mod;
    } else {
      initialSettings = mod;
    }

    const {listen, ...props} = initialSettings;
    return async function before(): Promise<void> {
      let instance: PlatformBuilder;
      // @ts-ignore

      const settings = DITest.configure(props);

      adapter(settings.adapter || adapter());
      const configuration = defineConfiguration(settings);

      instance = await PlatformBuilder.build(configuration.rootModule, configuration).bootstrap();

      await instance.listen(!!listen);
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
   * @deprecated use PlatformTest.injector.invoke instead
   * @param targets
   * @param func
   */
  static inject<T>(targets: any[], func: (...args: any[]) => Promise<T> | T): () => Promise<T> {
    return async (): Promise<T> => {
      await PlatformTest.create();

      const inj: InjectorService = injector();
      const deps = [];

      for (const target of targets) {
        deps.push(inj.has(target) ? inj.get(target) : await inj.invoke(target));
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
    return injector().get<PlatformApplication>(PlatformApplication)?.callback() as any;
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
