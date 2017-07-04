/**
 * @module filters
 */
/** */
import {BodyParamsFilter} from "../components/BodyParamsFilter";
import {Type} from "../../core/interfaces/Type";
import {ParamRegistry} from "../../mvc/registries/ParamRegistry";
/**
 *
 * @param expression
 * @param useType
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function BodyParams(expression?: string | any, useType?: any): Function {

    return <T>(target: Type<T>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamRegistry.useFilter(BodyParamsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}