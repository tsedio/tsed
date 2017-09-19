/**
 * @module swagger
 */
/** */
import {Tag} from "swagger-schema-official";
import {PropertyRegistry} from "../../converters/registries/PropertyRegistry";
import {Store} from "../../core/class/Store";
import {DecoratorParameters} from "../../core/interfaces";
import {getDecoratorType} from "../../core/utils";

export function Tag(tag: Tag|any) {
    return Store.decorate((store: Store, parameters: DecoratorParameters) => {
        store.merge("tag", tag);
    });
}