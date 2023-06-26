import type {InjectorService} from "../../common/index";
import {setLoggerFormat} from "./setLoggerFormat";
import {setLoggerLevel} from "./setLoggerLevel";

export function setLoggerConfiguration(injector: InjectorService) {
  setLoggerLevel(injector);
  setLoggerFormat(injector);
}
