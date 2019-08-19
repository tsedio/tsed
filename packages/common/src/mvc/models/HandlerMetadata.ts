import {Metadata, Type} from "@tsed/core";
import {PARAM_METADATA} from "../constants";
import {HandlerType} from "../interfaces/HandlerType";
import {ParamMetadata} from "../models/ParamMetadata";
import {ParamRegistry} from "../registries/ParamRegistry";
import {ParamTypes} from "./ParamTypes";

export interface IHandlerConstructorOptions {
  target: Type<any> | Function;
  token?: Type<any>;
  propertyKey?: string | symbol;
  type?: HandlerType;
}

export class HandlerMetadata {
  readonly target: any;
  readonly token: Type<any>;
  /**
   * @deprecated
   */
  readonly methodClassName: string;
  readonly propertyKey: string | symbol;
  /**
   * @deprecated
   */
  readonly method: string;
  readonly injectable: boolean = false;
  readonly type: HandlerType = HandlerType.FUNCTION;
  readonly hasErrorParam: boolean = false;
  readonly hasNextFunction: boolean = false;
  handler: any;

  constructor(options: IHandlerConstructorOptions) {
    const {target, token, propertyKey, type = HandlerType.FUNCTION} = options;

    this.type = type;
    this.handler = propertyKey ? target.prototype[propertyKey] : target;

    if (propertyKey) {
      this.target = target;
      this.token = token!;
      this.propertyKey = propertyKey;
      this.methodClassName = String(propertyKey);
      this.method = String(propertyKey);
      this.hasNextFunction = this.hasParamType(ParamTypes.NEXT_FN);
      this.hasErrorParam = this.hasParamType(ParamTypes.ERR);
      this.injectable = (Metadata.get(PARAM_METADATA, target, propertyKey) || []).length > 0;
    }

    if (!this.injectable) {
      this.hasErrorParam = this.handler.length === 4;
      this.hasNextFunction = this.handler.length >= 3;
    }
  }

  /**
   * @deprecated
   */
  get services() {
    return this.parameters;
  }

  get parameters(): ParamMetadata[] {
    if (this.injectable) {
      return this.getParams();
    }
    // Emulate ParamMetadata
    const parameters: any[] = [];

    if (this.hasErrorParam) {
      parameters.push({index: 0, service: ParamTypes.ERR});
    }

    parameters.push({index: parameters.length, service: ParamTypes.REQUEST});
    parameters.push({index: parameters.length, service: ParamTypes.RESPONSE});

    if (this.hasNextFunction) {
      parameters.push({index: parameters.length, service: ParamTypes.NEXT_FN});
    }

    return parameters;
  }

  public getParams() {
    return ParamRegistry.getParams(this.target, this.propertyKey) || [];
  }

  public hasParamType(paramType: any): boolean {
    return this.getParams().findIndex(p => p.service === paramType) > -1;
  }
}
