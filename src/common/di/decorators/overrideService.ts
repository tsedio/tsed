import {OverrideProvider} from "./overrideProvider";

/**
 * Override a service which is already registered in ProviderRegistry.
 * @returns {Function}
 * @decorators
 * @param targetService
 */
export const OverrideService = OverrideProvider;