/**
 * @module swagger
 */
/** */
import {Store} from "../../core/class/Store";

export function Security(securityDefinitionName: string, ...scopes: string[]) {
    return (...args) => {
        Store.from(...args).merge("security", [{[securityDefinitionName]: scopes}]);
        return args[2];
    };
}