import type {Logger} from "@tsed/logger";
import {InjectorService} from "../services/InjectorService";
import {setLoggerConfiguration} from "./setLoggerConfiguration";

export function attachLogger(injector: InjectorService, $log: Logger) {
  injector.logger = $log;
  setLoggerConfiguration(injector);
}
