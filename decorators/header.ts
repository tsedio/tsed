import {attachInject} from "../lib/attach-inject";

/**
 * 
 * @param expression
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Header(expression: string){
    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {
            attachInject(target[propertyKey], parameterIndex, (request) => (request.get(expression)));
        }

    };
}
