import type {InjectablePropertyType} from "../domain/InjectablePropertyType";
import type {TokenProvider} from "./TokenProvider";
import type {InjectorService} from "../services/InjectorService";
import type {InvokeOptions} from "./InvokeOptions";

export interface InjectableProperty {
  propertyKey: string;
}

export interface InjectablePropertyOptions extends InjectableProperty {
  bindingType: InjectablePropertyType.METHOD | InjectablePropertyType.PROPERTY | InjectablePropertyType.INTERCEPTOR;
  propertyType: string;
  useType?: TokenProvider;
  resolver: (injector: InjectorService, locals: Map<TokenProvider, any>, options: Partial<InvokeOptions> & {options: any}) => () => any;
  options?: any;
}

export interface InjectablePropertyValue extends InjectableProperty {
  bindingType: InjectablePropertyType.CONSTANT | InjectablePropertyType.VALUE;
  expression: string;
  defaultValue?: any;
}

export interface InjectableProperties {
  [key: string]: InjectablePropertyOptions | InjectablePropertyValue;
}
