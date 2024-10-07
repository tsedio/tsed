import {injector as $injector} from "./injector.js";

export function constant<Type>(expression: string): Type | undefined;
export function constant<Type>(expression: string, defaultValue: Type | undefined): Type;
export function constant<Type>(expression: string, defaultValue?: Type | undefined): Type | undefined {
  return $injector().settings.get(expression, defaultValue);
}
