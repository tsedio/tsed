import {Store} from "../../../core/class/Store";

export function Scope(scope: false | "request" = "request") {
    return Store.decorate((store) => {
        store.set("scope", scope);
    });
}