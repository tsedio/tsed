import {DILogger, InjectorService} from "../../common/index";
import {setLoggerConfiguration} from "./setLoggerConfiguration";

export function attachLogger(injector: InjectorService, $log: DILogger) {
  injector.logger = $log;
  setLoggerConfiguration(injector);
}
