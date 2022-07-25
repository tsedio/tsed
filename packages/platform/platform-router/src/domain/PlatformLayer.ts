import {isPrimitive, nameOf, Type} from "@tsed/core";
import {Provider} from "@tsed/di";
import {PlatformParamsCallback} from "@tsed/platform-params";
import {PlatformHandlerMetadata} from "./PlatformHandlerMetadata";
import type {PlatformRouter} from "./PlatformRouter";
import {SinglePathType} from "./SinglePathType";

export interface PlatformLayerOptions extends Record<string, any> {
  token?: Type<any>;
  isFinal?: boolean;
}

export interface PlatformLayerProps {
  provider: Provider;
  path: SinglePathType;
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

  #args: PlatformParamsCallback[];

  constructor(props: Partial<PlatformLayerProps> = {}) {
    Object.assign(this, props);
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
}
