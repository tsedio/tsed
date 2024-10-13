import {DIConfiguration} from "../services/DIConfiguration.js";
import {injector} from "./injector.js";

export function configuration() {
  return injector().settings as TsED.DIConfiguration & DIConfiguration;
}
