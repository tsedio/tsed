/**
 * @module filters
 */
/** */
import {SessionFilter} from "../components/SessionFilter";
import {Type} from "../../core/interfaces/Type";
import {ParamRegistry} from "../../mvc/registries/ParamRegistry";
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

            ParamRegistry.useFilter(SessionFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}
