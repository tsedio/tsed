import {isBuffer, isString, useDecorators} from "@tsed/core";
import {Any} from "@tsed/schema";
import {ParamOptions} from "../domain/ParamOptions";
import {ParamTypes} from "../domain/ParamTypes";
import {ParamFn} from "./paramFn";
import {UseDeserialization} from "./useDeserialization";
import {UseParamType} from "./useParamType";
import {UseType} from "./useType";
import {UseValidation} from "./useValidation";

/**
 * @ignore
 * @param options
 */
function mapPipes(options: Partial<ParamOptions>) {
  const {paramType, useType, expression, useValidation, useMapper, ...props} = options;

  return [
    useType
      ? UseType(useType)
      : ParamFn((entity, parameters) => {
          if (entity.isCollection && entity.type === Object && paramType !== ParamTypes.FILES) {
            Any()(...parameters);
          }
        }),
    useValidation && UseValidation(),
    useMapper && UseDeserialization(props)
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
 * @param options
 * @decorator
 * @operation
 * @input
 * @pipe
 */
export function UseParam(options: Partial<ParamOptions>): ParameterDecorator {
  return useDecorators(UseParamType(options as any), ...mapPipes(options)) as ParameterDecorator;
}
