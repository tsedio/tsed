import {Configurable} from "./configurable.js";

export function NotConfigurable(): Function {
  return Configurable(false);
}
