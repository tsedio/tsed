/**
 * @module filters
 */
/** */
import {HeaderParamsFilter} from "../components/HeaderParamsFilter";
import {Type} from "../../core/interfaces/Type";
import {ParamsRegistry} from "../../mvc/registries/ParamsRegistry";
/**
 *
 * @param expression
 * @returns {(target:any, propertyKey:(string|symbol), parameterIndex:number)=>void}
 * @decorator
 */
export function HeaderParams(expression: string): Function {

    return <T>(target: Type<T>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamsRegistry.useFilter(HeaderParamsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression
            });

        }

    };
}