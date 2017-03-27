/**
 * @module mvc
 */
/** */
import {UseAfter} from "./method/useAfter";
import {HeaderParams} from "../../filters/decorators/headerParams";
/**
 * Sets the response’s HTTP header field to value. To set multiple fields at once, pass an object as the parameter.
 *
 * ```typescript
 *  @Header('Content-Type', 'text/plain');
 *  private myMethod() {}
 *  @Header({
 *    'Content-Type': 'text/plain',
 *    'Content-Length': '123',
 *    'ETag': '12345'
 *  })
 *  private myMethod() {}
 * ```
 * @param expression
 * @param expressionValue
 * @returns {Function}
 * @decorator
 */
export function Header(expression: string | { [key: string]: string }, expressionValue?: string) {

    return <T>(target: any, propertyKey: string | symbol, descriptor: number | TypedPropertyDescriptor<T>): void => {

        if (typeof descriptor === "number") {
            return HeaderParams(expression as string)(target, propertyKey, descriptor as number);
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
