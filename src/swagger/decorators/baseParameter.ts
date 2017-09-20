import {BaseParameter} from "swagger-schema-official";
import {Store} from "../../core/class/Store";
import {DecoratorParameters} from "../../core/interfaces";

export function BaseParameter(baseParameter: BaseParameter | any) {
    return Store.decorate((store: Store, parameters: DecoratorParameters) => {
        store.merge("baseParameter", baseParameter);
    });
}