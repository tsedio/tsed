import {cleanObject} from "@tsed/core";
import {Configuration, InjectorService, ProviderScope, registerProvider} from "@tsed/di";
import Ajv, {Format, KeywordDefinition, Vocabulary} from "ajv";
import AjvFormats from "ajv-formats";
import {FormatsMethods} from "../interfaces/FormatsMethods";
import {IAjvSettings} from "../interfaces/IAjvSettings";

function getHandler(key: string, service: any) {
  if (service[key]) {
    return service[key].bind(service);
  }
}

function getKeywordProviders(injector: InjectorService) {
  return injector.getProviders("ajv:keyword");
}

function bindKeywords(injector: InjectorService): Vocabulary {
  return getKeywordProviders(injector).map((provider) => {
    const options = provider.store.get<Omit<KeywordDefinition, "compile">>("ajv:keyword", {})!;
    const service = injector.invoke(provider.token);

    return <KeywordDefinition>cleanObject({
      coerceTypes: "array",
      ...options,
      validate: getHandler("validate", service),
      compile: getHandler("compile", service),
      code: getHandler("code", service),
      macro: getHandler("macro", service)
    });
  });
}

function getFormatsProviders(injector: InjectorService) {
  return injector.getProviders("ajv:formats");
}

function getFormats(injector: InjectorService): {name: string; options: Format}[] {
  return getFormatsProviders(injector).map((provider) => {
    const {name, options} = provider.store.get<any>("ajv:formats", {})!;
    const service = injector.invoke<FormatsMethods<any>>(provider.token);

    return {
      name,
      options: {
        ...options,
        validate: service.validate.bind(service),
        compare: service.compare?.bind(service)
      }
    };
  });
}

registerProvider({
  provide: Ajv,
  deps: [Configuration, InjectorService],
  scope: ProviderScope.SINGLETON,
  useFactory(configuration: Configuration, injector: InjectorService) {
    const {errorFormatter, keywords = [], ...props} = configuration.get<IAjvSettings>("ajv") || {};
    const options = {
      verbose: false,
      coerceTypes: true,
      strict: false,
      keywords: [...keywords, ...bindKeywords(injector)],
      discriminator: true,
      ...props
    };

    const ajv = new Ajv(options);

    AjvFormats(ajv as any);

    getFormats(injector).forEach(({name, options}) => {
      ajv.addFormat(name, options);
    });

    return ajv;
  }
});
