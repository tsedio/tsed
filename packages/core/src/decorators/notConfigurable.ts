import {Configurable} from "./configurable";

export function NotConfigurable(): Function {
  return Configurable(false);
}
