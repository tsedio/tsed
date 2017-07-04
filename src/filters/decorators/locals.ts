import {Type} from "../../core/interfaces/Type";
import {LocalsFilter} from "../components/LocalsFilter";
import {ParamRegistry} from "../../mvc/registries/ParamRegistry";
/**
 *
 * @param expression
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Locals(expression?: string | any): Function {

    return <T>(target: Type<T>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamRegistry.useFilter(LocalsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useConverter: false
            });

        }

    };
}