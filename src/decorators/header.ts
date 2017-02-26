
import {HeaderParams} from "./params";
import {UseAfter} from "./use-after";

/**
 *
 * @param expression
 * @param expressionValue
 * @returns {Function}
 * @constructor
 */
export function Header(expression: string | {[key: string]: string}, expressionValue?: string) {

    return <T>(target: any, propertyKey: string | symbol, descriptor: number | TypedPropertyDescriptor<T>): void => {

        if (typeof descriptor === "number") {
            return HeaderParams(expression)(target, propertyKey, descriptor as number);
        }

        return UseAfter((request, response, next) => {

            if (response.headersSent) {
                next();
                return;
            }
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
