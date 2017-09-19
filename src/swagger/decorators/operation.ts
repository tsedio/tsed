/**
 * @module swagger
 */
/** */
import {Operation} from "swagger-schema-official";
import {PropertyRegistry} from "../../converters/registries/PropertyRegistry";
import {Store} from "../../core/class/Store";
import {DecoratorParameters} from "../../core/interfaces";
import {getDecoratorType} from "../../core/utils";

export function Operation(operation: Operation|any) {
    return Store.decorate((store: Store, parameters: DecoratorParameters) => {
        store.merge("operation", operation);
    });
}