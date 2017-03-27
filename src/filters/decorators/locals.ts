import {Type} from "../../core/interfaces/Type";
import {LocalsFilter} from "../components/LocalsFilter";
import {ParamsRegistry} from "../../mvc/registries/ParamsRegistry";
/**
 *
 * @param expression
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Locals(expression?: string | any): Function {

    return <T>(target: Type<T>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamsRegistry.useFilter(LocalsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useConverter: false
            });

        }

    };
}