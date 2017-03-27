/**
 * @module filters
 */
/** */
import {SessionFilter} from "../components/SessionFilter";
import {Type} from "../../core/interfaces/Type";
import {ParamsRegistry} from "../../mvc/registries/ParamsRegistry";
/**
 *
 * @param expression
 * @param useType
 * @returns {(target:any, propertyKey:(string|symbol), parameterIndex:number)=>void}
 * @decorator
 */
export function Session(expression?: string | any, useType?: any): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamsRegistry.useFilter(SessionFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}
