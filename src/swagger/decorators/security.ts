/**
 * @module swagger
 */
/** */
import {Store} from "../../core/class/Store";

export function Security(securityDefinitionName: string, ...scopes: string[]) {
    return Store.decorate((store: Store) => {
        store.merge("security", [{[securityDefinitionName]: scopes}]);
    });
}