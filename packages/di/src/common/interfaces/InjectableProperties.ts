import type {InjectablePropertyType} from "../domain/InjectablePropertyType.js";
import type {LocalsContainer} from "../domain/LocalsContainer.js";
import type {TokenProvider} from "./TokenProvider.js";
import type {InjectorService} from "../services/InjectorService.js";
import type {InvokeOptions} from "./InvokeOptions.js";

export interface InjectableProperty {
  propertyKey: string;
}

export interface InjectablePropertyOptions extends InjectableProperty {
  bindingType: InjectablePropertyType.METHOD | InjectablePropertyType.PROPERTY | InjectablePropertyType.INTERCEPTOR;
  propertyType: string;
  useType?: TokenProvider;
  resolver: (injector: InjectorService, locals: LocalsContainer, options: Partial<InvokeOptions> & {options: any}) => () => any;
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
