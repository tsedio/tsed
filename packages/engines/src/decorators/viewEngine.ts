import {ViewEngineOptions} from "../components/Engine";
import {engines} from "../registries/EnginesContainer";

export function ViewEngine(name: string, options: ViewEngineOptions = {}): ClassDecorator {
  return (target: any) => {
    engines.set(target, {name, useClass: target, options});
  };
}
