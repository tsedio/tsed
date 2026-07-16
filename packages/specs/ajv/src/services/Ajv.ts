import {Ajv, Format, KeywordDefinition, Options, Vocabulary} from "ajv";
import {ProviderScope, constant, inject, injectable, injector} from "@tsed/di";
import AjvErrors from "ajv-errors";
import AjvFormats from "ajv-formats";
import {AjvSettings} from "../interfaces/AjvSettings.js";
import {FormatsMethods} from "../interfaces/FormatsMethods.js";
import {cleanObject} from "@tsed/core";

function getHandler(key: string, service: any) {
  if (service[key]) {
    return service[key].bind(service);
  }
}

function getKeywordProviders() {
  return injector().getProviders("ajv:keyword");
}

function bindKeywords(): Vocabulary {
  return getKeywordProviders().map((provider) => {
    const options = provider.store.get<Omit<KeywordDefinition, "compile">>("ajv:keyword", {})!;
    const service = inject(provider.token);

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

function getFormatsProviders() {
  return injector().getProviders("ajv:formats");
}

function getFormats(): {name: string; options: Format}[] {
  return getFormatsProviders().map((provider) => {
    const {name, options} = provider.store.get<any>("ajv:formats", {})!;
    const service = inject<FormatsMethods<any>>(provider.token);

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

injectable(Ajv)
  .scope(ProviderScope.SINGLETON)
  .factory(() => {
    const {errorFormatter, keywords = [], ...props} = constant<AjvSettings>("ajv") || {};
    const options: Options = {
      verbose: false,
      coerceTypes: true,
      strict: false,
      keywords: [...keywords, ...bindKeywords()],
      discriminator: true,
      allErrors: true,
      ...props
    };

    // @ts-ignore
    const ajv = new Ajv(options);

    // add support for custom error messages
    // @ts-ignore
    AjvErrors(ajv);
    // @ts-ignore
    AjvFormats(ajv as any);

    getFormats().forEach(({name, options}) => {
      ajv.addFormat(name, options);
    });

    return ajv;
  });
