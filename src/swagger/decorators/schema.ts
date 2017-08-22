/**
 * @module swagger
 */
/** */
import {Schema} from "swagger-schema-official";
import {PropertyRegistry} from "../../converters/registries/PropertyRegistry";
import {Store} from "../../core/class/Store";

export function Schema(schema: Schema) {
    return (...args: any[]) => {
        if (args.length === 3 && typeof args[2] !== "number") {
            const property = PropertyRegistry.get(args[0], args[1]);
            property.store.merge("schema", schema);
        } else {
            Store.from(...args).merge("schema", schema);
        }

        return args[2];
    };
}