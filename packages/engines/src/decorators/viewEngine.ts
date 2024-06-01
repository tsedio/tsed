import {ViewEngineOptions} from "../components/Engine.js";
import {engines} from "../registries/EnginesContainer.js";

export function ViewEngine(name: string, options: ViewEngineOptions = {}): ClassDecorator {
  return (target: any) => {
    engines.set(target, {name, useClass: target, options});
  };
}
