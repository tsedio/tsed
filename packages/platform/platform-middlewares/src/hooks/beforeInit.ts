import {type Env, isClass, isFunction, isString, nameOf} from "@tsed/core";
import {configuration, constant, inject} from "@tsed/di";
import {$on} from "@tsed/hooks";
import type {PlatformMiddlewareLoadingOptions} from "../domain/PlatformMiddlewareSettings.js";

export async function beforeInit() {
  const env = constant<Env>("env");
  const defaultHook = "$beforeRoutesInit";
  const middlewares = constant<PlatformMiddlewareLoadingOptions[]>("middlewares", []);
  // HACK to fix the circular dependency issue around platform-multer -> platform-http -> platform-middlewares
  const platformAdapter = inject<{bodyParser: any}>("PlatformAdapter");

  const promises = middlewares.map(async (middleware: PlatformMiddlewareLoadingOptions): Promise<PlatformMiddlewareLoadingOptions> => {
    if (isFunction(middleware)) {
      return {
        env,
        hook: defaultHook,
        use: middleware
      };
    }

    if (isString(middleware)) {
      middleware = {env, use: middleware, hook: defaultHook};
    }

    let {use, options} = middleware;

    if (isString(use)) {
      if (["text-parser", "raw-parser", "json-parser", "urlencoded-parser"].includes(use)) {
        use = platformAdapter.bodyParser(use.replace("-parser", ""), options);
      } else {
        const mod = await import(use);
        use = (mod.default || mod)(options);
      }
    }

    if (isClass(use) && ["$beforeInit", "$onInit", "$afterInit"].includes(middleware.hook!)) {
      throw new Error(
        `Ts.ED Middleware "${nameOf(use)}" middleware cannot be added on ${
          middleware.hook
        } hook. Use one of this hooks instead: $beforeRoutesInit, $onRoutesInit, $afterRoutesInit, $beforeListen, $afterListen, $onReady`
      );
    }

    return {
      env,
      hook: defaultHook,
      ...middleware,
      use
    };
  });

  configuration().set(
    "middlewares",
    (await Promise.all(promises)).filter((middleware) => middleware.use)
  );
}

$on("$beforeInit", beforeInit);
