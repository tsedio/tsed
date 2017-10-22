/**
 * @module swagger
 */
/** */
import {Schema} from "swagger-schema-official";
import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";
import {Store} from "../../core/class/Store";
import {DecoratorParameters} from "../../core/interfaces";
import {getDecoratorType} from "../../core/utils";

export function Schema(schema: Schema) {
    return Store.decorate((store: Store, parameters: DecoratorParameters) => {
        if (getDecoratorType(parameters) === "property") {
            PropertyRegistry.get(parameters[0], parameters[1]);
        }

        store.merge("schema", schema);
    });
}