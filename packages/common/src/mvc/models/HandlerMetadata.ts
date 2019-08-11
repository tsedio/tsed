import {Metadata, Type} from "@tsed/core";
import {PARAM_METADATA} from "../constants";
import {HandlerType} from "../interfaces/HandlerType";
import {ParamMetadata} from "../models/ParamMetadata";
import {ParamRegistry} from "../registries/ParamRegistry";
import {ParamTypes} from "./ParamTypes";

export interface IHandlerOptions {
  target: Type<any> | Function;
  token?: Type<any>;
  method?: string;
  type?: HandlerType;
}

export class HandlerMetadata {
  readonly target: any;
  readonly token: Type<any>;
  readonly methodClassName: string;
  readonly method: string;
  readonly injectable: boolean = false;
  readonly type: HandlerType = HandlerType.FUNCTION;
  readonly hasErrorParam: boolean = false;
  readonly hasNextFunction: boolean = false;
  handler: any;

  constructor(options: IHandlerOptions) {
    const {target, token, method, type = HandlerType.FUNCTION} = options;

    this.type = type;
    this.handler = method ? target.prototype[method] : target;

    if (method) {
      this.target = target;
      this.token = token!;
      this.methodClassName = method;
      this.method = method;
      this.hasNextFunction = this.hasParamType(ParamTypes.NEXT_FN);
      this.hasErrorParam = this.hasParamType(ParamTypes.ERR);
      this.injectable = (Metadata.get(PARAM_METADATA, target, method) || []).length > 0;
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

    const parameters: any[] = [{service: ParamTypes.REQUEST}, {service: ParamTypes.RESPONSE}];

    if (this.hasErrorParam) {
      parameters.unshift({service: ParamTypes.ERR});
    }

    if (this.hasNextFunction) {
      parameters.push({service: ParamTypes.NEXT_FN});
    }

    return parameters;
  }

  public getParams() {
    return ParamRegistry.getParams(this.target, this.methodClassName) || [];
  }

  public hasParamType(paramType: any): boolean {
    return this.getParams().findIndex(p => p.service === paramType) > -1;
  }
}
