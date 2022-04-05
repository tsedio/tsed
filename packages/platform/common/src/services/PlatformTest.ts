import {DITest, DITestOptions, InjectorService} from "@tsed/di";
import {Type} from "@tsed/core";
import {PlatformBuilder} from "../builder/PlatformBuilder";
import {PlatformContext, PlatformContextOptions} from "../domain/PlatformContext";
import {createInjector} from "../utils/createInjector";
import {PlatformApplication} from "./PlatformApplication";
import {getConfiguration} from "../utils/getConfiguration";
import {PlatformAdapter, PlatformBuilderSettings} from "./PlatformAdapter";
import accepts from "accepts";
import {FakeAdapter} from "./FakeAdapter";

/**
 * @platform
 */
export class PlatformTest extends DITest {
  public static adapter: Type<PlatformAdapter>;

  static async create(settings: DITestOptions = {}) {
    DITest.injector = PlatformTest.createInjector(getConfiguration(settings));
    await DITest.createContainer(settings);
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

      instance = await PlatformBuilder.build(mod, settings).bootstrap();
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

  static createRequest(options: any = {}): any {
    return {
      headers: {},
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
    return {
      headers: {},
      locals: {},
      statusCode: 200,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      contentType(content: string) {
        this.set("content-type", content);
      },
      contentLength(content: number) {
        this.set("content-length", content);
      },
      redirect(status: number, path: string) {
        this.statusCode = status;
        this.set("location", path);
      },
      location(path: string) {
        this.set("location", path);
      },
      get(key: string) {
        return this.headers[key.toLowerCase()];
      },
      getHeaders() {
        return this.headers;
      },
      set(key: string, value: any) {
        this.headers[key.toLowerCase()] = value;
        return this;
      },
      send(data: any) {
        this.data = data;
      },
      json(data: any) {
        this.data = data;
      },
      ...options
    };
  }

  static createRequestContext(options: Partial<PlatformContextOptions & any> = {}) {
    const event = {
      request: options?.request?.request || options?.event?.request || PlatformTest.createRequest(),
      response: options?.response?.response || options?.event?.response || PlatformTest.createResponse()
    };

    return new PlatformContext({
      id: "id",
      injector: DITest.injector,
      logger: DITest.injector.logger,
      url: "/",
      ...options,
      event
    });
  }
}
