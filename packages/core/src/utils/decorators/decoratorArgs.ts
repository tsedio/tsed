import {DecoratorParameters} from "../../interfaces/DecoratorParameters.js";
import {descriptorOf} from "../objects/descriptorOf.js";

export function decoratorArgs(target: any, propertyKey: string): DecoratorParameters {
  return [target, propertyKey, descriptorOf(target, propertyKey)!];
}
