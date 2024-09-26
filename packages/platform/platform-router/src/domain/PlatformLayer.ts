import type {Type} from "@tsed/core";
import {isPrimitive, nameOf} from "@tsed/core";
import type {Provider} from "@tsed/di";
import type {PlatformParamsCallback} from "@tsed/platform-params";
import {concatPath} from "@tsed/schema";

import type {PlatformHandlerMetadata} from "./PlatformHandlerMetadata.js";
import type {PlatformRouter} from "./PlatformRouter.js";
import type {SinglePathType} from "./SinglePathType.js";

export interface PlatformLayerOptions extends Record<string, any> {
  token?: Type<any>;
}

export interface PlatformLayerProps {
  parent: PlatformLayer;
  provider: Provider;
  path: SinglePathType;
  basePath: SinglePathType;
  method: string;
  handlers: any[];
  router: PlatformRouter;
  opts: PlatformLayerOptions;
}

export class PlatformLayer {
  public provider: Provider;
  public path: SinglePathType = "";
  public method: string;
  public handlers: PlatformHandlerMetadata[] = [];
  public router?: PlatformRouter;
  public opts: PlatformLayerOptions = {};

  public layers: PlatformLayer[] = [];

  public parent?: PlatformLayer;
  basePath: SinglePathType;
  #args: PlatformParamsCallback[];

  constructor(props: Partial<PlatformLayerProps> = {}) {
    Object.assign(this, props);

    this.layers = this.layers.map((layer) => {
      return new PlatformLayer({
        ...layer,
        parent: this
      });
    });
  }

  set(args: PlatformParamsCallback[]) {
    this.#args = args;
  }

  getArgs() {
    return [this.path, ...this.#args].filter(Boolean);
  }

  isProvider() {
    return !!this.provider;
  }

  inspect() {
    return {
      basePath: this.getBasePath(),
      path: this.path,
      method: this.method,
      handlers: this.handlers.map((item: any) => String(item)),
      opts: Object.entries(this.opts).reduce((obj, [key, value]) => {
        return {
          ...obj,
          [key]: isPrimitive(value) ? value : nameOf(value)
        };
      }, {})
    };
  }

  getBasePath(): string {
    return concatPath(this.parent?.getBasePath(), this.basePath);
  }

  setLayers(layers: PlatformLayer[]) {
    this.layers = layers.map((layer) => {
      return new PlatformLayer({
        ...layer,
        parent: this
      });
    });
  }
}
