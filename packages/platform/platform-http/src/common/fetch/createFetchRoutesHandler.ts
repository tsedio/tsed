import {PlatformHandlerType, type PlatformLayer} from "@tsed/platform-router";
import type {PlatformContextHandler} from "@tsed/platform-router";
import type {PlatformFetchHandler} from "./PlatformFetchHandler.js";
import {createFetchHandler} from "./createFetchHandler.js";

function escapePath(path: string) {
  return path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchPath(path: string | RegExp, pathname: string): Record<string, string> | undefined {
  if (path instanceof RegExp) {
    return path.test(pathname) ? {} : undefined;
  }

  const keys: string[] = [];
  const pattern = escapePath(path)
    .replace(/\/:([A-Za-z0-9_]+)(\\\?)?/g, (_match, key: string, optional: string) => {
      keys.push(key);
      return optional ? "(?:/([^/]+))?" : "/([^/]+)";
    })
    .replace(/\\\{\\\*([^}]+)\\\}/g, (_match, key: string) => {
      keys.push(key);
      return "(.*)";
    });
  const match = new RegExp(`^${pattern}/?$`).exec(pathname);

  if (!match) {
    return undefined;
  }

  return keys.reduce(
    (params, key, index) => {
      if (match[index + 1] !== undefined) {
        params[key] = decodeURIComponent(match[index + 1]);
      }
      return params;
    },
    {} as Record<string, string>
  );
}

function matchesMethod(method: string, layer: PlatformLayer) {
  return layer.method === "all" || layer.method === method.toLowerCase();
}

/**
 * Compiles already-built Ts.ED route layers into the direct Fetch entry point.
 * Host adapters can reuse the compiled work while retaining native transport
 * conversion at their boundary.
 */
export function createFetchRoutesHandler(layers: PlatformLayer[]): PlatformFetchHandler {
  return createFetchHandler(async ($ctx) => {
    const pathname = new URL($ctx.request.fetch!.url).pathname;
    const layer = layers.find((candidate) => matchesMethod($ctx.request.method, candidate) && matchPath(candidate.path, pathname));

    if (!layer) {
      $ctx.response.status(404).body("Not Found");
      return;
    }

    $ctx.request.setParams(matchPath(layer.path, pathname)!);

    for (const handler of layer.handlers) {
      if (handler.type === PlatformHandlerType.RESPONSE_FN) {
        continue;
      }

      await (handler.compiledHandler || (handler.handler as PlatformContextHandler))($ctx);
      if ($ctx.isDone()) {
        return;
      }
    }
  });
}
