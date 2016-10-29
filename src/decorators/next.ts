import {attachInject} from "../metadata/attach-inject";

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Next(): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {
            attachInject(target[propertyKey], parameterIndex, "next");
        }
    };
}
