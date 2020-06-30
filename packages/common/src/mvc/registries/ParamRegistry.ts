import {Type} from "@tsed/core";
import {IParamOptions} from "../interfaces/IParamOptions";
import {IParamConstructorOptions, IPipe, ParamMetadata} from "../models/ParamMetadata";
import {ParamTypes} from "../models/ParamTypes";
import {DeserializerPipe} from "../pipes/DeserializerPipe";
import {ParseExpressionPipe} from "../pipes/ParseExpressionPipe";
import {ValidationPipe} from "../pipes/ValidationPipe";

export interface IUseFilterOptions extends IParamConstructorOptions, IParamOptions<any> {
}

/**
 * @deprecated Use ParamMetadata instead of
 */
export class ParamRegistry extends ParamMetadata {
  /**
   * @param filter
   * @param options
   * @deprecated
   */
  /* istanbul ignore next */
  static useFilter(filter: string | Type<any> | ParamTypes, options: IUseFilterOptions): ParamMetadata {
    const {expression, useType, propertyKey, index, target, useConverter, useValidation} = options;
    let {paramType} = options;

    const param = ParamRegistry.get(target!, propertyKey!, index);

    if (typeof filter === "string") {
      paramType = filter as ParamTypes;
    } else {
      param.filter = filter;
    }

    param.expression = expression!;

    if (paramType) {
      param.paramType = paramType!;
    }

    if (useType) {
      param.type = useType;
    }

    param.pipes = [
      param.expression && ParseExpressionPipe,
      useValidation && (param.type || param.collectionType) && ValidationPipe,
      useConverter && DeserializerPipe,
      ...param.pipes
    ].filter(Boolean) as Type<IPipe>[];

    return param;
  }
}
