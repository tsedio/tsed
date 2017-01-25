import InjectParams from "../services/inject-params";
import {GET_HEADER} from "../constants/metadata-keys";

/**
 * 
 * @param expression
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Header(expression: string) {
    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

            const injectParams = InjectParams.get(target, propertyKey, parameterIndex);

            injectParams.service = GET_HEADER;
            injectParams.expression = expression;

            InjectParams.set(target, propertyKey, parameterIndex, injectParams);

        }

    };
}
