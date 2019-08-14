import {Deprecated, Metadata, Type} from "@tsed/core";
import {PARAM_METADATA} from "../constants";
import {IParamConstructorOptions, ParamMetadata} from "../models/ParamMetadata";
import {ParamTypes} from "../models/ParamTypes";

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
   *
   * @param target
   * @param propertyKey
   * @param parameterIndex
   * @param allowedRequiredValues
   * @deprecated
   */
  // istanbul ignore next
  @Deprecated("ParamRegistry.decorate are deprecated.")
  static required(target: Type<any>, propertyKey: string | symbol, parameterIndex: number, allowedRequiredValues: any[] = []) {
    const param = ParamRegistry.get(target, propertyKey, parameterIndex);

    param.required = true;
    param.allowedRequiredValues = allowedRequiredValues;

    param.store.merge("responses", {
      "400": {
        description: "BadRequest"
      }
    });

    return this;
  }

  /**
   * Create a parameters decorators
   * @param token
   * @param {Partial<IParamConstructorOptions<any>>} options
   * @returns {Function}
   * @deprecated
   */
  // istanbul ignore next
  @Deprecated("ParamRegistry.decorate are deprecated. Use UseFilter decorator instead")
  static decorate(token: string | Type<any> | ParamTypes, options: Partial<IParamConstructorOptions> = {}): ParameterDecorator {
    return (target: Type<any>, propertyKey: string | symbol, index: number): any => {
      if (typeof index === "number") {
        const settings = Object.assign(
          {
            target,
            propertyKey,
            index
          },
          options
        );

        ParamRegistry.useFilter(token, settings);
      }
    };
  }

  static useFilter(filter: string | Type<any> | ParamTypes, options: IParamConstructorOptions): ParamMetadata {
    const {expression, useType, propertyKey, index, target, useConverter, useValidation} = options;
    let {paramType} = options;

    const param = ParamRegistry.get(target, propertyKey, index);

    if (typeof filter === "string") {
      paramType = filter as ParamTypes;
    }

    param.service = filter;
    param.useValidation = !!useValidation;
    param.expression = expression!;

    if (paramType) {
      param.paramType = paramType!;
    }

    if (useType) {
      param.type = useType;
    }

    if (useConverter !== undefined) {
      param.useConverter = useConverter;
    }

    return param;
  }
}
