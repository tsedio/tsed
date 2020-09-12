import {Type} from "@tsed/core";
import {PlatformRouteOptions, PlatformRouteWithoutHandlers} from "../../platform/interfaces/PlatformRouterMethods";
import {HandlerType} from "../interfaces/HandlerType";
import {ParamMetadata} from "../models/ParamMetadata";
import {ParamTypes} from "./ParamTypes";

export interface HandlerMetadataOptions {
  target: (Type<any> | Function) & {type?: HandlerType};
  routeOptions?: PlatformRouteWithoutHandlers;
  token?: Type<any>;
  propertyKey?: string | symbol;
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
  handler: any;

  constructor(options: HandlerMetadataOptions) {
    const {target, token, propertyKey, type, routeOptions} = options;

    this.type = type || target.type || HandlerType.RAW_FN;
    this.routeOptions = routeOptions || {};
    this.handler = propertyKey ? target.prototype[propertyKey] : target;

    if (propertyKey) {
      this.target = target;
      this.token = token!;
      this.propertyKey = propertyKey;
      this.hasNextFunction = this.hasParamType(ParamTypes.NEXT_FN);

      if (this.hasParamType(ParamTypes.ERR)) {
        this.type = HandlerType.ERR_MIDDLEWARE;
      }

      this.injectable = ParamMetadata.getParams(target as any, propertyKey).length > 0;
    }

    if (!this.injectable) {
      if (this.handler.length === 4) {
        this.type = HandlerType.RAW_ERR_FN;
      }
      this.hasNextFunction = this.handler.length >= 3;
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
}
