import {InjectorService, ProviderType, registerProvider} from "@tsed/di";
import {ConverterService} from "../converters";
import {JsonSchemesService} from "../jsonschema";
import {ControllerBuilder} from "./builders/ControllerBuilder";
import {ControllerProvider} from "./models/ControllerProvider";
import {ParseService} from "./services/ParseService";
import {RouteService} from "./services/RouteService";
import {ValidationService} from "./services/ValidationService";

export const MVC_MODULE = Symbol.for("MVC_MODULE");

registerProvider({
  provide: MVC_MODULE,
  deps: [InjectorService, ConverterService, ParseService, ValidationService, JsonSchemesService, RouteService],
  useFactory(injector: InjectorService) {
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
});
