/**
 * @module swagger
 */
/** */
import {Tag} from "swagger-schema-official";
import {Store} from "../../core/class/Store";
import {DecoratorParameters} from "../../core/interfaces";

export function Tag(tag: Tag|any) {
    return Store.decorate((store: Store, parameters: DecoratorParameters) => {
        store.merge("tag", tag);
    });
}