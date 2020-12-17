import {Configuration, InjectorService, ProviderScope, registerProvider} from "@tsed/di";
import Ajv from "ajv";
import AjvFormats from "ajv-formats";
import {IAjvSettings} from "../interfaces/IAjvSettings";

registerProvider({
  provide: Ajv,
  deps: [Configuration, InjectorService],
  scope: ProviderScope.SINGLETON,
  useFactory(configuration: Configuration, injector: InjectorService) {
    const {errorFormatter, keywords = {}, ...props} = configuration.get<IAjvSettings>("ajv") || {};

    const ajv = new Ajv({
      verbose: false,
      coerceTypes: true,
      async: true,
      strict: false,
      ...props
    } as any);

    AjvFormats(ajv);

    return ajv;
  }
});
