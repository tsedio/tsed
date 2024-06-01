import type {InjectorService} from "../../common/index.js";
import {setLoggerFormat} from "./setLoggerFormat.js";
import {setLoggerLevel} from "./setLoggerLevel.js";

export function setLoggerConfiguration(injector: InjectorService) {
  setLoggerLevel(injector);
  setLoggerFormat(injector);
}
