import {DILogger} from "../interfaces/DILogger";
import {registerProvider} from "../registries/ProviderRegistry";
import {InjectorService} from "./InjectorService";

export const LOGGER = Symbol.for("LOGGER");
export type LOGGER = DILogger;

registerProvider({
  provide: LOGGER,
  deps: [InjectorService],
  useFactory(injector: InjectorService) {
    return injector.logger;
  }
});
