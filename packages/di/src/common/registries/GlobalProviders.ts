import {Provider} from "../domain/Provider.js";

/**
 * Registry for managing global providers in the dependency injection system.
 * Extends the Map class to store TokenProvider-Provider pairs.
 * @deprecated Use Provider.Registry instead
 */
// tslint:disable-next-line: variable-name
export const GlobalProviders = Provider.Registry;
