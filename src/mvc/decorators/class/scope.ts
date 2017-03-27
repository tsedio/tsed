/**
 * @module mvc
 */
/** */
import {ControllerRegistry} from "../../registries/ControllerRegistry";
/**
 *
 * @decorator
 * @param scope
 */
export function Scope(scope: false | "request" = "request") {

    return (target) => {
        ControllerRegistry.merge(target, {scope});
    };
}