/**
 *
 */
export interface IInjectableProperty {
  propertyKey: string;
}

export interface IInjectablePropertyService extends IInjectableProperty {
  bindingType: "method" | "property";
  propertyType: string;
  useType: any;
}

export interface IInjectablePropertyValue extends IInjectableProperty {
  bindingType: "value" | "constant";
  expression: string;
  defaultValue?: any;
}

export interface IInjectablePropertyCustom extends IInjectableProperty {
  bindingType: "custom";
  onInvoke: (injector: any, instance: any, definition?: IInjectablePropertyCustom) => void;

  [key: string]: any;
}

export interface IInjectableProperties {
  [key: string]: IInjectablePropertyService | IInjectablePropertyValue | IInjectablePropertyCustom;
}
