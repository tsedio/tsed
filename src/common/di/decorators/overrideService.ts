import {OverrideProvider} from "./overrideProvider";

/**
 * Override a service which is already registered in ProviderRegistry.
 * @returns {Function}
 * @decorators
 * @param targetService
 */
// tslint:disable-next-line: variable-name
export const OverrideService = OverrideProvider;
