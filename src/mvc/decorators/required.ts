/**
 * @module mvc
 */ /** */

import {Type} from "../../core/interfaces/Type";
import {ParamsRegistry} from "../registries/ParamsRegistry";
/**
 * Add required annotation for a function argument .
 * @returns {Function}
 * @decorator
 */
export function Required(): any {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamsRegistry.required(target, propertyKey, parameterIndex);

        }

    };

}