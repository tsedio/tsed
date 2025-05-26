import {DecoratorParameters} from "../types/DecoratorParameters.js";
import {descriptorOf} from "./descriptorOf.js";

export function decoratorArgs(target: any, propertyKey: string): DecoratorParameters {
  return [target, propertyKey, descriptorOf(target, propertyKey)!];
}
