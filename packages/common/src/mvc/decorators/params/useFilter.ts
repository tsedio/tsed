import {Type} from "@tsed/core";
import {IParamOptions} from "../../interfaces/IParamOptions";
import {ParamTypes} from "../../models/ParamTypes";
import {ParamRegistry} from "../../registries/ParamRegistry";

export function UseFilter(token: Type<any> | ParamTypes | string, options: IParamOptions<any> = {}): ParameterDecorator {
  return (target: Type<any>, propertyKey: string | symbol, index: number): any => {
    ParamRegistry.useFilter(token, {
      target,
      propertyKey,
      index,
      ...options
    });
  };
}
