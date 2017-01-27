
import {HeaderParams} from "./params";
import {UseBefore} from "./use-before";

/**
 * 
 * @param expression
 * @param expressionValue
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Header(expression: string | {[key: string]: string}, expressionValue?: string) {

    return <T>(target: any, propertyKey: string | symbol, descriptor: number | TypedPropertyDescriptor<T>): void => {

        if (typeof descriptor === 'number') {
            return HeaderParams(expression)(target, propertyKey, descriptor as number);
        }

        return UseBefore((request, response, next) => {

            if (expressionValue !== undefined) {
                response.set(expression, expressionValue);
            } else {
                Object.keys(expression).forEach((key) => {
                    response.set(key, expression[key]);
                });
            }

            next();

        })(target, propertyKey, descriptor);

    };
}
