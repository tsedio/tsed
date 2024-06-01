import {Env, getValue, isClass, isPromise, setValue} from "@tsed/core";
import {$log} from "@tsed/logger";
import {createContainer, InjectorService, LocalsContainer, OnInit, Provider, TokenProvider, TokenProviderOpts} from "../../common/index.js";
import {DIContext} from "../domain/DIContext.js";
import {setLoggerConfiguration} from "../utils/setLoggerConfiguration.js";

/**
 * Tool to run test with lightweight DI sandbox.
 */
export class DITest {
  static options: Partial<TsED.Configuration> = {};
  protected static _injector: InjectorService | null = null;

  static get injector(): InjectorService {
    if (DITest._injector) {
      return DITest._injector!;
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

  static set injector(injector: InjectorService) {
    DITest._injector = injector;
  }

  static set(key: string, value: any) {
    setValue(DITest.options, key, value);
  }

  static hasInjector() {
    return !!DITest._injector;
  }

  static async create(settings: Partial<TsED.Configuration> = {}) {
    settings = {
      ...DITest.options,
      ...settings
    };

    DITest.injector = DITest.createInjector(settings);

    await DITest.createContainer();
  }

  static async createContainer() {
    await DITest.injector.load(createContainer());
  }

  /**
   * Create a new injector with the right default services
   */
  static createInjector(settings: any = {}): InjectorService {
    const injector = new InjectorService();
    injector.logger = $log;

    // @ts-ignore
    injector.settings.set(DITest.configure(settings));

    setLoggerConfiguration(injector);

    return injector;
  }

  /**
   * Resets the test injector of the test context, so it won't pollute your next test. Call this in your `tearDown` logic.
   */
  static async reset() {
    if (DITest.hasInjector()) {
      await DITest.injector.destroy();
      DITest._injector = null;
    }
  }

  /**
   * Invoke a provider and return a fresh instance
   * @param target
   * @param providers
   */
  static async invoke<T = any>(target: TokenProvider, providers: TokenProviderOpts[] = []): Promise<T> {
    const locals = new LocalsContainer();
    providers.forEach((p) => {
      locals.set(p.token, p.use);
    });

    locals.set(InjectorService, DITest.injector);

    const instance: OnInit = DITest.injector.invoke(target, locals, {rebuild: true});

    if (instance && instance.$onInit) {
      // await instance.$onInit();
      const result = instance.$onInit();

      if (result instanceof Promise) {
        return result.then(() => instance as any);
      }
    }

    if (isClass(instance)) {
      await Promise.all(Object.values(instance).filter(isPromise));
    }

    return instance as any;
  }

  /**
   * Return the instance from injector registry
   * @param target
   * @param options
   */
  static get<T = any>(target: TokenProvider, options: any = {}): T {
    return DITest.injector.get<T>(target, options)!;
  }

  static createDIContext() {
    return new DIContext({
      id: "id",
      injector: DITest.injector,
      logger: DITest.injector.logger
    });
  }

  protected static configure(settings: Partial<TsED.Configuration> = {}): Partial<TsED.Configuration> {
    return {
      ...settings,
      env: getValue(settings, "env", Env.TEST),
      logger: {
        ...getValue(settings, "logger", {}),
        level: getValue(settings, "logger.level", "off")
      }
    };
  }
}
