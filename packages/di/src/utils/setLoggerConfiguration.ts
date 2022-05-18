import type {InjectorService} from "../services/InjectorService";
import {setLoggerFormat} from "./setLoggerFormat";
import {setLoggerLevel} from "./setLoggerLevel";

export function setLoggerConfiguration(injector: InjectorService) {
  setLoggerLevel(injector);
  setLoggerFormat(injector);
}
