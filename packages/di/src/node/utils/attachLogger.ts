import type {DILogger, InjectorService} from "../../common/index.js";
import {setLoggerConfiguration} from "./setLoggerConfiguration.js";

export function attachLogger(injector: InjectorService, $log: DILogger) {
  injector.logger = $log;
  setLoggerConfiguration(injector);
}
