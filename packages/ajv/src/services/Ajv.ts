import {cleanObject} from "@tsed/core";
import {Configuration, InjectorService, ProviderScope, registerProvider} from "@tsed/di";
import Ajv, {KeywordDefinition, Vocabulary} from "ajv";
import AjvFormats from "ajv-formats";
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
      ...options,
      validate: getHandler("validate", service),
      compile: getHandler("compile", service),
      code: getHandler("code", service),
      macro: getHandler("macro", service)
    });
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
      ...props
    };

    const ajv = new Ajv(options);

    AjvFormats(ajv);

    return ajv;
  }
});
