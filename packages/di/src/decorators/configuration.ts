import {DecoratorParameters, getDecoratorType} from "@tsed/core";
import {DIConfiguration, Inject} from "@tsed/di";
import {IDIConfigurationOptions} from "../interfaces/IDIConfigurationOptions";
import {ProviderScope} from "../interfaces/ProviderScope";
import {ProviderType} from "../interfaces/ProviderType";
import {Injectable} from "./injectable";

export type Configuration = IDIConfigurationOptions & DIConfiguration;

export function Configuration(configuration: Partial<IDIConfigurationOptions> = {}): Function {
  return (...args: DecoratorParameters) => {
    switch (getDecoratorType(args, true)) {
      case "class":
        Injectable({
          type: ProviderType.PROVIDER,
          scope: ProviderScope.SINGLETON,
          configuration,
          injectable: false
        })(args[0]);

        break;
      case "parameter.constructor":
        return Inject(Configuration)(...args);
    }
  };
}
