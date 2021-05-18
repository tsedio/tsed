import type {InjectablePropertyType} from "../domain/InjectablePropertyType";
import type {TokenProvider} from "./TokenProvider";

export interface InjectableProperty {
  propertyKey: string;
}

export interface InjectablePropertyService extends InjectableProperty {
  bindingType: InjectablePropertyType.METHOD | InjectablePropertyType.PROPERTY | InjectablePropertyType.INTERCEPTOR;
  propertyType: string;
  useType: TokenProvider;
  onGet?: (bean: any) => any;
  options?: any;
}

export interface InjectablePropertyValue extends InjectableProperty {
  bindingType: InjectablePropertyType.CONSTANT | InjectablePropertyType.VALUE;
  expression: string;
  defaultValue?: any;
}

export interface InjectableProperties {
  [key: string]: InjectablePropertyService | InjectablePropertyValue;
}
