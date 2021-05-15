import {nameOf, Type} from "@tsed/core";
import {InjectorService, LocalsContainer, ProviderScope} from "@tsed/di";
import {PlatformRouteOptions, PlatformRouteWithoutHandlers} from "../../platform/interfaces/PlatformRouterMethods";
import {HandlerType} from "../interfaces/HandlerType";
import {ParamMetadata} from "../models/ParamMetadata";
import {ParamTypes} from "./ParamTypes";

export interface HandlerMetadataOptions {
  injector: InjectorService;
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
  readonly handler: any;

  #injector: InjectorService;

  constructor(options: HandlerMetadataOptions) {
    const {injector, target, token, propertyKey, type, scope, routeOptions} = options;

    this.#injector = injector;

    this.type = type || target.type || HandlerType.RAW_FN;
    this.scope = scope || ProviderScope.SINGLETON;
    this.routeOptions = routeOptions || {};

    if (propertyKey) {
      this.target = target;
      this.token = token!;
      this.propertyKey = propertyKey;
      this.hasNextFunction = this.hasParamType(ParamTypes.NEXT_FN);

      if (scope === ProviderScope.SINGLETON) {
        const instance = this.#injector.get(token);

        this.handler = instance[this.propertyKey!].bind(instance);
      }

      if (this.hasParamType(ParamTypes.ERR)) {
        this.type = HandlerType.ERR_MIDDLEWARE;
      }

      this.injectable = ParamMetadata.getParams(target as any, propertyKey).length > 0;
    } else {
      this.handler = target;
    }

    const handler = propertyKey ? target.prototype[propertyKey] : target;

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

  get parameters(): ParamMetadata[] {
    if (this.injectable) {
      return this.getParams();
    }
    // Emulate ParamMetadata
    const parameters: any[] = [];

    if (this.hasErrorParam) {
      parameters.push(
        new ParamMetadata({
          target: this.target,
          propertyKey: this.propertyKey,
          index: 0,
          paramType: ParamTypes.ERR
        })
      );
    }

    parameters.push(
      new ParamMetadata({
        target: this.target,
        propertyKey: this.propertyKey,
        index: parameters.length,
        paramType: ParamTypes.REQUEST
      })
    );
    parameters.push(
      new ParamMetadata({
        target: this.target,
        propertyKey: this.propertyKey,
        index: parameters.length,
        paramType: ParamTypes.RESPONSE
      })
    );

    if (this.hasNextFunction) {
      parameters.push(
        new ParamMetadata({
          target: this.target,
          propertyKey: this.propertyKey,
          index: parameters.length,
          paramType: ParamTypes.NEXT_FN
        })
      );
    }

    return parameters;
  }

  public getParams() {
    return ParamMetadata.getParams(this.target, this.propertyKey) || [];
  }

  public hasParamType(paramType: any): boolean {
    return this.getParams().findIndex((p) => p.paramType === paramType) > -1;
  }

  public isFinal() {
    return this.routeOptions?.isFinal || false;
  }

  getHandler(container: LocalsContainer) {
    if (this.handler) {
      return this.handler;
    }

    const instance = this.#injector.invoke<any>(this.token, container);

    return instance[this.propertyKey!].bind(instance);
  }

  printHandler() {
    return this.propertyKey ? this.target.prototype[this.propertyKey] : this.target;
  }

  toString() {
    return [this.target && nameOf(this.target), this.propertyKey].filter(Boolean).join(".");
  }
}
