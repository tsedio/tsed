import {ProviderScope} from "./ProviderScope";

export interface IDISettings {
  get(key: string): any;

  set(key: string, value: any): this;

  scopes: {[key: string]: ProviderScope};

  [key: string]: any;
}
