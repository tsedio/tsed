import {Container, createContainer, InjectorService, LocalsContainer} from "@tsed/di";
import {PlatformModule} from "../PlatformModule";

/**
 * @ignore
 */
export async function loadInjector(injector: InjectorService, container: Container = createContainer()): Promise<LocalsContainer<any>> {
  injector.bootstrap(container);
  return injector.load(container, PlatformModule);
}
