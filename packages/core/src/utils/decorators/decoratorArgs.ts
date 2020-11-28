import {DecoratorParameters} from "../../interfaces/DecoratorParameters";
import {descriptorOf} from "../objects/descriptorOf";

export function decoratorArgs(target: any, propertyKey: string): DecoratorParameters {
  return [target, propertyKey, descriptorOf(target, propertyKey)!];
}
