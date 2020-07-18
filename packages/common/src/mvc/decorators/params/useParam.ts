import {UseType} from "./useType";
import {Type, useDecorators} from "@tsed/core";
import {Any, Name} from "@tsed/schema";
import {IFilter} from "../../interfaces/IFilter";
import {IParamOptions} from "../../interfaces/IParamOptions";
import {ParamTypes} from "../../models/ParamTypes";
import {ParamFn} from "./paramFn";
import {UseDeserialization} from "./useDeserialization";
import {UseParamExpression} from "./useParamExpression";
import {UseParamType} from "./useParamType";
import {UseValidation} from "./useValidation";

/**
 * @ignore
 * @param options
 */
function mapPipes(options: IParamOptions<any> = {}) {
  const {paramType, useType, expression, useValidation, useConverter, ...props} = options;

  return [
    useType
      ? UseType(useType)
      : ParamFn((entity, parameters) => {
          if (entity.isCollection && entity.type === Object) {
            Any()(...parameters);
          }
        }),
    expression && UseParamExpression(expression),
    expression && Name(expression),
    useValidation && UseValidation(),
    useConverter && UseDeserialization(props)
  ];
}

/**
 * Register a new param. It use the paramType to extract value and give it to the next pipe.
 *
 * Given options allow to enable or disable following pipes:
 *
 * - useType: Add extra type for the json mapper,
 * - expression: Get property from the returned value by the previous pipe.
 * - useValidation: Apply validation from the returned value by the previous pipe.
 * - useConverter: Apply json mapper from the returned value by the previous pipe.
 *
 * @param paramType
 * @param options
 * @decorator
 * @operation
 * @input
 * @pipe
 */
export function UseParam(paramType: ParamTypes | string, options: IParamOptions<any> = {}): ParameterDecorator {
  return useDecorators(UseParamType(paramType), ...mapPipes({paramType, ...options})) as ParameterDecorator;
}

/**
 * Register a new param
 * @param token
 * @param options
 * @decorator
 * @operation
 * @input
 * @deprecated Use UseParam instead
 */
export function UseFilter(token: Type<IFilter> | ParamTypes | string, options: IParamOptions<any> = {}): ParameterDecorator {
  let filter: any;
  if (typeof token === "string") {
    options.paramType = token;
  } else {
    filter = token;
  }

  return require("util").deprecate(
    useDecorators(
      filter &&
        ParamFn(param => {
          // deprecated
          param.filter = filter;
        }),
      options.paramType && UseParamType(options.paramType),
      ...mapPipes(options)
    ),
    "UseFilter is deprecated. Use UseParam instead"
  );
}
