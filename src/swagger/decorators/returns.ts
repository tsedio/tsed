import {Store} from "../../core/class/Store";
import {IResponsesOptions} from "../interfaces/index";

export function Returns(code: number, options: IResponsesOptions = {}) {
    return Store.decorate((store: Store) => {
        store.merge("responses", {
            [code]: {
                description: options.description,
                headers: options.headers,
                type: options.use,
                collectionType: options.collection
            }
        });
    });
}
