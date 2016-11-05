
import InjectParams from '../metadata/inject-params';

/**
 * Add required annotation for a function argument .
 * @returns {Function}
 */
export function Required(): any {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

            const injectParams = InjectParams.get(target, propertyKey, parameterIndex);

            injectParams.required = true;

            InjectParams.set(target, propertyKey, parameterIndex, injectParams);

        }

    };

}