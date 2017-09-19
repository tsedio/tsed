/**
 * @module swagger
 */
/** */
import {Operation} from "swagger-schema-official";
import {Store} from "../../core/class/Store";
import {DecoratorParameters} from "../../core/interfaces";

export function Operation(operation: Operation|any) {
    return Store.decorate((store: Store, parameters: DecoratorParameters) => {
        store.merge("operation", operation);
    });
}