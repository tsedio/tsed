import {Configuration, ProviderScope, registerProvider} from "@tsed/di";
import * as Ajv from "ajv";
import {IAjvSettings} from "../interfaces/IAjvSettings";

// tslint:disable-next-line:variable-name
export const AJV: any = Symbol.for("AJV");
export type AJV = Ajv.Ajv;

registerProvider({
  provide: AJV,
  deps: [Configuration],
  scope: ProviderScope.SINGLETON,
  useFactory(configuration: Configuration) {
    const {errorFormat, errorFormatter, options = {}, ...props} = configuration.get<IAjvSettings>("ajv") || {};

    return new Ajv({
      verbose: false,
      ...props,
      ...options
    });
  }
});
