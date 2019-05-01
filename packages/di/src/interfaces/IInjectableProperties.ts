import {InjectablePropertyType} from "./InjectablePropertyType";
import {TokenProvider} from "./TokenProvider";

export interface IInjectableProperty {
  propertyKey: string;
}

export interface IInjectablePropertyService extends IInjectableProperty {
  bindingType: InjectablePropertyType.METHOD | InjectablePropertyType.PROPERTY | InjectablePropertyType.INTERCEPTOR;
  propertyType: string;
  useType: TokenProvider;
  options?: any;
}

export interface IInjectablePropertyValue extends IInjectableProperty {
  bindingType: InjectablePropertyType.CONSTANT | InjectablePropertyType.VALUE;
  expression: string;
  defaultValue?: any;
}

export interface IInjectableProperties {
  [key: string]: IInjectablePropertyService | IInjectablePropertyValue;
}
