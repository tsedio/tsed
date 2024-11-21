import {setLoggerFormat} from "./setLoggerFormat.js";
import {setLoggerLevel} from "./setLoggerLevel.js";

export function setLoggerConfiguration() {
  setLoggerLevel();
  setLoggerFormat();
}
