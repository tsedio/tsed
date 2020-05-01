import {OverrideProvider} from "./overrideProvider";
// tslint:disable: variable-name
/**
 * Override a service which is already registered in ProviderRegistry.
 * @returns {Function}
 * @decorators
 * @param targetService
 * @deprecated Use OverrideProvider
 */
export const OverrideService = OverrideProvider;
