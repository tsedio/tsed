import {GlobalProviders, InjectorService} from "@tsed/di";
import {ConverterService} from "../../converters";
import {ParseService, ValidationService} from "../../mvc";
import {buildControllers} from "./buildControllers";

const TSED_MODULES = [ConverterService, ParseService, ValidationService];

export async function loadInjector(injector: InjectorService) {
  // Clone all providers in the container
  injector.addProviders(GlobalProviders);

  // invoke initial services
  TSED_MODULES.forEach(token => injector.invoke(token));

  // Build all controllers
  buildControllers(injector);

  await injector.load();
}
