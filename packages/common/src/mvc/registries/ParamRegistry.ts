import {Metadata, Type} from "@tsed/core";
import {PARAM_METADATA} from "../constants";
import {IParamOptions} from "../interfaces/IParamOptions";
import {IParamConstructorOptions, ParamMetadata, IPipe} from "../models/ParamMetadata";
import {ParamTypes} from "../models/ParamTypes";
import {DeserializerPipe} from "../pipes/DeserializerPipe";
import {ParseExpressionPipe} from "../pipes/ParseExpressionPipe";
import {ValidationPipe} from "../pipes/ValidationPipe";

export interface IUseFilterOptions extends IParamConstructorOptions, IParamOptions<any> {}

export class ParamRegistry {
  static get(target: Type<any>, propertyKey: string | symbol, index: number): ParamMetadata {
    const params = this.getParams(target, propertyKey);

    if (!this.has(target, propertyKey, index)) {
      params[index] = new ParamMetadata({target, propertyKey, index});
      this.set(target, propertyKey, index, params[index]);
    }

    return params[index];
  }

  static has(target: Type<any>, propertyKey: string | symbol, index: number) {
    return !!this.getParams(target, propertyKey)[index];
  }

  static set(target: Type<any>, propertyKey: string | symbol, index: number, paramMetadata: ParamMetadata): void {
    const params = this.getParams(target, propertyKey);

    params[index] = paramMetadata;

    Metadata.set(PARAM_METADATA, params, target, propertyKey);
  }

  static getParams(target: Type<any>, propertyKey: string | symbol): ParamMetadata[] {
    return Metadata.has(PARAM_METADATA, target, propertyKey) ? Metadata.get(PARAM_METADATA, target, propertyKey) : [];
  }

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
