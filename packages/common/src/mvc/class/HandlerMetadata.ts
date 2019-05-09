import {Metadata, Type} from "@tsed/core";
import {ParamMetadata} from "../../filters/class/ParamMetadata";
import {ENDPOINT_INFO, EXPRESS_ERR, EXPRESS_NEXT_FN, EXPRESS_REQUEST, EXPRESS_RESPONSE, PARAM_METADATA} from "../../filters/constants";
import {ParamRegistry} from "../../filters/registries/ParamRegistry";
import {HandlerType} from "../interfaces/HandlerType";

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
      this.hasNextFunction = this.hasParamType(EXPRESS_NEXT_FN);
      this.hasErrorParam = this.hasParamType(EXPRESS_ERR);
      this.injectable = (Metadata.get(PARAM_METADATA, target, method) || []).length > 0;
    }

    if (!this.injectable) {
      this.hasErrorParam = this.handler.length === 4;
      this.hasNextFunction = this.handler.length >= 3;
    }
  }

  get services(): ParamMetadata[] {
    if (this.injectable) {
      return this.getParams();
    }

    const parameters: any[] = [{service: EXPRESS_REQUEST}, {service: EXPRESS_RESPONSE}];

    if (this.hasErrorParam) {
      parameters.unshift({service: EXPRESS_ERR});
    }

    if (this.hasNextFunction) {
      parameters.push({service: EXPRESS_NEXT_FN});
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
