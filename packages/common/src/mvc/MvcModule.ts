import {InjectorService, Module, ProviderType} from "@tsed/di";
import {ConverterModule} from "../converters/ConverterModule";
import {JsonSchemesService} from "../jsonschema";
import {ControllerBuilder} from "./builders/ControllerBuilder";
import {ControllerProvider} from "./models/ControllerProvider";
import {ParseService} from "./services/ParseService";
import {RouteService} from "./services/RouteService";
import {ValidationService} from "./services/ValidationService";

@Module({
  imports: [InjectorService, ConverterModule, ParseService, ValidationService, JsonSchemesService, RouteService]
})
export class MvcModule {
  constructor(injector: InjectorService) {
    const routers = injector
      .getProviders(ProviderType.CONTROLLER)
      .map(provider => {
        if (!provider.hasParent()) {
          return new ControllerBuilder(provider as ControllerProvider).build(injector);
        }
      })
      .filter(Boolean);

    return {routers};
  }
}
