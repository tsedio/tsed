import {nameOf} from "@tsed/core";
import {DIContext, InjectorService, Provider, ProviderScope, TokenProvider} from "@tsed/di";
import {ParamTypes} from "@tsed/platform-params";
import {EndpointMetadata, JsonEntityStore, JsonParameterStore} from "@tsed/schema";

import {PlatformHandlerType} from "./PlatformHandlerType.js";
import {SinglePathType} from "./SinglePathType.js";

export interface PlatformHandlerMetadataOpts extends Record<string, any> {
  token?: TokenProvider;
}

export interface PlatformHandlerMetadataProps {
  provider?: Provider;
  handler?: any;
  opts?: PlatformHandlerMetadataOpts;
  propertyKey?: string | symbol;
  type?: PlatformHandlerType;
}

export class PlatformHandlerMetadata {
  path: SinglePathType;

  readonly provider?: Provider;
  readonly propertyKey: string | symbol;
  readonly type: PlatformHandlerType = PlatformHandlerType.RAW_FN;
  readonly hasNextFunction: boolean = false;
  readonly opts: PlatformHandlerMetadataOpts = {};
  compiledHandler: ($ctx: DIContext) => any;
  #handler: any;

  constructor(props: PlatformHandlerMetadataProps) {
    const {propertyKey, type, provider, handler, opts} = props;

    this.provider = provider;
    this.type = type || handler.type || PlatformHandlerType.RAW_FN;
    this.opts = opts || {};

    this.#handler = propertyKey ? this.target.prototype[propertyKey] : handler;

    if (propertyKey) {
      this.propertyKey = propertyKey;
      this.hasNextFunction = this.hasParamType(ParamTypes.NEXT_FN);

      if (this.hasParamType(ParamTypes.ERR)) {
        this.type = PlatformHandlerType.ERR_MIDDLEWARE;
      }
    } else {
      if (this.#handler.length === 4) {
        this.type = PlatformHandlerType.RAW_ERR_FN;
      }
      this.hasNextFunction = this.#handler.length >= 3;
    }
  }

  get target() {
    return this.provider?.useClass || this.#handler;
  }

  get token() {
    return this.provider?.token || this.#handler;
  }

  get handler() {
    return this.#handler;
  }

  get scope() {
    return this.provider?.scope || ProviderScope.SINGLETON;
  }

  get hasErrorParam() {
    return this.type === PlatformHandlerType.ERR_MIDDLEWARE || this.type === PlatformHandlerType.RAW_ERR_FN;
  }

  get store() {
    return JsonEntityStore.fromMethod(this.provider!.useClass, this.propertyKey!);
  }

  static from(injector: InjectorService, input: any, opts: PlatformHandlerMetadataOpts = {}): PlatformHandlerMetadata {
    if (input instanceof PlatformHandlerMetadata) {
      return input;
    }

    if (input instanceof EndpointMetadata) {
      const provider = injector.getProvider(opts.token)!;

      return new PlatformHandlerMetadata({
        provider,
        type: PlatformHandlerType.ENDPOINT,
        propertyKey: input.propertyKey,
        opts
      });
    }

    const provider = injector.getProvider(input);

    if (provider) {
      return new PlatformHandlerMetadata({
        provider,
        type: PlatformHandlerType.MIDDLEWARE,
        propertyKey: "use",
        opts
      });
    }

    return new PlatformHandlerMetadata({
      handler: input,
      type: input.type,
      opts
    });
  }

  public getParams() {
    return JsonParameterStore.getParams(this.target, this.propertyKey) || [];
  }

  public hasParamType(paramType: any): boolean {
    return this.getParams().findIndex((p) => p.paramType === paramType) > -1;
  }

  public isInjectable() {
    return !(this.isRawFn() || this.isResponseFn());
  }

  public isRawFn() {
    return this.type === PlatformHandlerType.RAW_ERR_FN || this.type === PlatformHandlerType.RAW_FN;
  }

  public isEndpoint() {
    return this.type === PlatformHandlerType.ENDPOINT;
  }

  public isCtxFn() {
    return this.type === PlatformHandlerType.CTX_FN;
  }

  public isResponseFn() {
    return this.type === PlatformHandlerType.RESPONSE_FN;
  }

  toString() {
    return [nameOf(this.target), this.propertyKey].filter(Boolean).join(".");
  }
}
