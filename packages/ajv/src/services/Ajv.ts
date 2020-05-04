import {Configuration, ProviderScope, registerProvider} from "@tsed/di";
import * as AjvKlass from "ajv";
import {IAjvSettings} from "../interfaces/IAjvSettings";

// tslint:disable-next-line:variable-name
export const Ajv: any = AjvKlass;
export type Ajv = AjvKlass.Ajv;

registerProvider({
  provide: Ajv,
  deps: [Configuration],
  scope: ProviderScope.SINGLETON,
  useFactory(configuration: Configuration) {
    const {errorFormat, errorFormatter, options = {}, ...props} = configuration.get<IAjvSettings>("ajv") || {};

    return new AjvKlass({
      verbose: false,
      ...props,
      ...options
    });
  }
});
