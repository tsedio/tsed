import {Container, createContainer, InjectorService, LocalsContainer} from "@tsed/di";

/**
 * @ignore
 * @deprecated User injector.load(container, module) instead
 */
export async function loadInjector(injector: InjectorService, container: Container = createContainer()): Promise<LocalsContainer<any>> {
  injector.bootstrap(container);
  return injector.load(container);
}
