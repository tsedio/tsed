import {DecoratorParameters, getDecoratorType, StoreSet} from "@tsed/core";
import {Inject} from "../decorators/inject";
import {IDIConfigurationOptions} from "../interfaces/IDIConfigurationOptions";
import {DIConfiguration} from "../services/DIConfiguration";

export type Configuration = IDIConfigurationOptions & DIConfiguration;

export function Configuration(configuration: Partial<IDIConfigurationOptions> = {}): Function {
  return (...args: DecoratorParameters) => {
    switch (getDecoratorType(args, true)) {
      case "class":
        StoreSet("configuration", configuration)(args[0]);

        break;
      case "parameter.constructor":
        return Inject(Configuration)(...args);
    }
  };
}
