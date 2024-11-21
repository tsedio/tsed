import {Env, getValue, isClass, isObject} from "@tsed/core";
import {$log} from "@tsed/logger";

import {cleanAllLocalsContainer, detachLocalsContainer, localsContainer} from "../../common/fn/localsContainer.js";
import {
  createContainer,
  destroyInjector,
  DI_INJECTABLE_PROPS,
  hasInjector,
  inject,
  injector,
  InjectorService,
  type OnInit,
  TokenProvider,
  type UseImportTokenProviderOpts
} from "../../common/index.js";
import {DIContext} from "../domain/DIContext.js";
import {logger} from "../fn/logger.js";
import {setLoggerConfiguration} from "../utils/setLoggerConfiguration.js";

/**
 * Tool to run test with lightweight DI sandbox.
 */
export class DITest {
  static get injector() {
    return injector();
  }

  static async create(settings: Partial<TsED.Configuration> = {}) {
    DITest.createInjector(settings);
    await DITest.createContainer();
  }

  static async createContainer() {
    await injector().load(createContainer());
  }

  /**
   * Create a new injector with the right default services
   */
  static createInjector(settings: any = {}): InjectorService {
    const inj = injector({
      rebuild: true,
      logger: $log,
      settings: DITest.configure(settings)
    });

    setLoggerConfiguration();

    return inj;
  }

  /**
   * Resets the test injector of the test context, so it won't pollute your next test. Call this in your `tearDown` logic.
   */
  static async reset() {
    if (hasInjector()) {
      await destroyInjector();
      cleanAllLocalsContainer();
    }
  }

  /**
   * Invoke a provider and return a fresh instance
   * @param target
   * @param providers
   */
  static async invoke<T = any>(target: TokenProvider<T>, providers: UseImportTokenProviderOpts[] = []): Promise<T> {
    const locals = localsContainer({providers, rebuild: true});

    const instance: T & OnInit = inject<T & OnInit>(target, {locals, rebuild: true});

    if (instance && isObject(instance) && "$onInit" in instance) {
      const result = instance.$onInit();

      if (result instanceof Promise) {
        return result
          .then(() => {
            return;
          })
          .then(() => instance as any);
      }
    }

    if (isClass(instance)) {
      const keys = (instance as any)[DI_INJECTABLE_PROPS];

      if (keys) {
        await Promise.all([...keys.keys()].map((key: string) => (instance as any)[key]));
      }
    }

    detachLocalsContainer();

    return instance as any;
  }

  /**
   * Return the instance from injector registry
   * @param target
   * @param options
   */
  static get<T = any>(target: TokenProvider, options: any = {}): T {
    return injector().get<T>(target, options)!;
  }

  static createDIContext() {
    return new DIContext({
      id: "id",
      injector: injector(),
      logger: logger()
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
