import {Type} from "@tsed/core";
import {IInjectableParamSettings} from "../../interfaces/IInjectableParamSettings";
import {ParamTypes} from "../../models/ParamTypes";
import {ParamRegistry} from "../../registries/ParamRegistry";

export function UseFilter(token: Type<any> | ParamTypes | string, options: Partial<IInjectableParamSettings<any>> = {}): ParameterDecorator {
  return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): any => {
    const settings = Object.assign(
      {
        target,
        propertyKey,
        parameterIndex
      },
      options
    );

    ParamRegistry.useFilter(token, settings);
  };
}
