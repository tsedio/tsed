import {DILogger} from "../interfaces/DILogger.js";
import {registerProvider} from "../registries/ProviderRegistry.js";
import {InjectorService} from "./InjectorService.js";

export const LOGGER = Symbol.for("LOGGER");
export type LOGGER = DILogger;

registerProvider({
  provide: LOGGER,
  deps: [InjectorService],
  useFactory(injector: InjectorService) {
    return injector.logger;
  }
});
