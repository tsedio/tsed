import {AnyDecorator} from "../../interfaces/AnyDecorator.js";
import {descriptorOf} from "../objects/descriptorOf.js";

export function useMethodDecorator(decorator: AnyDecorator) {
  return (target: any, propertyKey: string | symbol) => decorator(target, propertyKey, descriptorOf(target, propertyKey));
}

export function useMethodDecorators(...decorators: AnyDecorator[]) {
  return (target: any, propertyKey: string | symbol) => {
    decorators.filter(Boolean).forEach((decorator) => decorator(target, propertyKey, descriptorOf(target, propertyKey)));
  };
}
