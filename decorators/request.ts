import {attachInject} from "../lib/attach-inject";

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Request(): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {
            attachInject(target[propertyKey], parameterIndex, "request");
        }
    };
}