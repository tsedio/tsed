import {isString} from "@tsed/core";
import {injectable, Provider, ProviderScope} from "@tsed/di";
import {concatPath} from "@tsed/schema";

import {formatMethod} from "../utils/formatMethod.js";
import {PlatformHandlerMetadata} from "./PlatformHandlerMetadata.js";
import {PlatformLayer, PlatformLayerOptions} from "./PlatformLayer.js";
import {SinglePathType} from "./SinglePathType.js";

function printHandler(handler: any) {
  return handler.toString().split("{")[0].trim();
}

export class PlatformRouter {
  readonly layers: PlatformLayer[] = [];
  provider: Provider;
  #isBuilt = false;

  use(...handlers: any[]) {
    const layer = handlers.reduce(
      (layer: PlatformLayer, item) => {
        if (isString(item) || item instanceof RegExp) {
          layer.path = item;
          layer.basePath = item;
        } else {
          if (item instanceof PlatformRouter) {
            layer.router = item;
            layer.setLayers(item.layers);

            if (!this.provider && item.provider) {
              layer.path = concatPath(layer.path, item.provider.path);
            } else {
              layer.path = layer.path || item.provider.path;
            }
          } else {
            item = PlatformHandlerMetadata.from(item);
          }

          layer.handlers.push(item);
        }

        return layer;
      },
      new PlatformLayer({
        method: "use",
        basePath: this.provider?.path || "/",
        provider: this.provider
      })
    );

    this.layers.push(layer);

    return this;
  }

  addRoute(method: string, path: SinglePathType, handlers: any[], opts: PlatformLayerOptions = {}) {
    const layer = new PlatformLayer({
      provider: this.provider,
      method: formatMethod(method),
      path,
      handlers: handlers.map((input) => {
        return PlatformHandlerMetadata.from(input, opts);
      }),
      opts
    });

    this.layers.push(layer);

    return this;
  }

  all(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("all", path, handlers);
  }

  get(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("get", path, handlers);
  }

  post(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("post", path, handlers);
  }

  put(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("put", path, handlers);
  }

  delete(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("delete", path, handlers);
  }

  patch(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("patch", path, handlers);
  }

  head(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("head", path, handlers);
  }

  options(path: SinglePathType, ...handlers: any[]) {
    return this.addRoute("options", path, handlers);
  }

  statics(path: string, options: any) {
    return this.addRoute("statics", path, [], options);
  }

  inspect() {
    return this.layers.map((layer) => {
      const obj = layer.inspect();

      return {
        ...obj,
        handlers: obj.handlers.map(printHandler),
        path: concatPath(this.provider?.path, obj.path)
      };
    });
  }

  isBuilt() {
    if (this.#isBuilt) {
      return true;
    }

    this.#isBuilt = true;

    return false;
  }
}

injectable(PlatformRouter).scope(ProviderScope.INSTANCE);
