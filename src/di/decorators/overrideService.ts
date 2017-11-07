import {Type} from "../../core/interfaces";
import {ProviderRegistry} from "../registries/ProviderRegistry";

/**
 * Override a service which is already registered in ProviderRegistry.
 * @returns {Function}
 * @decorators
 * @param targetService
 */
export function OverrideService(targetService: Type<any>): Function {
    return (target: Type<any>): void => {
        ProviderRegistry.merge(targetService, {useClass: target});
    };
}