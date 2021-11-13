import {nameOf, Type} from "@tsed/core";
import {ProviderScope} from "@tsed/di";
import {ParamTypes} from "@tsed/platform-params";
import {JsonParameterStore} from "@tsed/schema";
import {HandlerType} from "../interfaces/HandlerType";
import {PlatformRouteOptions, PlatformRouteWithoutHandlers} from "../interfaces/PlatformRouteOptions";

export interface HandlerMetadataOptions {
  target: (Type<any> | Function) & {type?: HandlerType};
  routeOptions?: PlatformRouteWithoutHandlers;
  token?: Type<any>;
  propertyKey?: string | symbol;
  scope?: ProviderScope;
  type?: HandlerType;
}

export class HandlerMetadata {
  readonly target: any;
  readonly token: Type<any>;
  readonly propertyKey: string | symbol;
  readonly injectable: boolean = false;
  readonly type: HandlerType = HandlerType.RAW_FN;
  readonly hasNextFunction: boolean = false;
  readonly routeOptions: Partial<PlatformRouteOptions>;
  readonly scope: ProviderScope;

  handler: any;

  constructor(options: HandlerMetadataOptions) {
    const {target, token, propertyKey, type, scope, routeOptions} = options;

    this.type = type || target.type || HandlerType.RAW_FN;
    this.scope = scope || ProviderScope.SINGLETON;
    this.routeOptions = routeOptions || {};
    const handler = propertyKey ? target.prototype[propertyKey] : target;

    if (propertyKey) {
      this.target = target;
      this.token = token!;
      this.propertyKey = propertyKey;
      this.hasNextFunction = this.hasParamType(ParamTypes.NEXT_FN);

      if (this.hasParamType(ParamTypes.ERR)) {
        this.type = HandlerType.ERR_MIDDLEWARE;
      }

      this.injectable = JsonParameterStore.getParams(target as any, propertyKey).length > 0;
    } else {
      this.handler = handler;
    }

    if (!this.injectable) {
      if (handler.length === 4) {
        this.type = HandlerType.RAW_ERR_FN;
      }
      this.hasNextFunction = handler.length >= 3;
    }
  }

  get hasErrorParam() {
    return this.type === HandlerType.ERR_MIDDLEWARE || this.type === HandlerType.RAW_ERR_FN;
  }

  public getParams() {
    return JsonParameterStore.getParams(this.target, this.propertyKey) || [];
  }

  public hasParamType(paramType: any): boolean {
    return this.getParams().findIndex((p) => p.paramType === paramType) > -1;
  }

  public isFinal() {
    return this.routeOptions?.isFinal || false;
  }

  toString() {
    return [this.target && nameOf(this.target), this.propertyKey].filter(Boolean).join(".");
  }
}
