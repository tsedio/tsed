import {Container, InjectorService, LocalsContainer} from "@tsed/di";
import {PlatformModule} from "../../platform";
import {createContainer} from "./createContainer";

export async function loadInjector(injector: InjectorService, container: Container = createContainer()): Promise<LocalsContainer<any>> {
  // Clone all providers in the container
  injector.addProviders(container);

  // Resolve all configuration
  injector.resolveConfiguration();

  injector.settings.forEach((value, key) => {
    injector.logger.debug(`settings.${key} =>`, value);
  });

  injector.invoke(PlatformModule);

  return injector.load(container);
}
