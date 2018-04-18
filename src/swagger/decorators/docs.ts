import {DecoratorParameters, Store} from "@tsed/core";

/**
 *
 * @returns {Function}
 * @decorator
 * @swagger
 * @param docs
 */
export function Docs(...docs: string[]) {
    return Store.decorate((store: Store, parameters: DecoratorParameters) => {
        store.merge("docs", docs);
    });
}