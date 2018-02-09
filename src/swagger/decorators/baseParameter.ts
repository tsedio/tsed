import {DecoratorParameters, Store} from "@tsed/core";
import {BaseParameter} from "swagger-schema-official";

/**
 *
 * @param {BaseParameter | any} baseParameter
 * @returns {Function}
 * @decorator
 * @swagger
 */
export function BaseParameter(baseParameter: BaseParameter | any) {
    return Store.decorate((store: Store, parameters: DecoratorParameters) => {
        store.merge("baseParameter", baseParameter);
    });
}