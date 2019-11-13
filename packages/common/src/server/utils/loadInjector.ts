import {Container, InjectorService, LocalsContainer} from "@tsed/di";
import {MvcModule} from "../../mvc";
import {createContainer} from "./createContainer";

export async function loadInjector(injector: InjectorService, container: Container = createContainer()): Promise<LocalsContainer<any>> {
  // Clone all providers in the container
  injector.addProviders(container);

  // Resolve all configuration
  injector.resolveConfiguration();

  injector.settings.forEach((value, key) => {
    injector.logger.debug(`settings.${key} =>`, value);
  });

  injector.invoke(MvcModule);

  return injector.load(container);
}
