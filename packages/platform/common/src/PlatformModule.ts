import {InjectorService, Module, ProviderType} from "@tsed/di";
import {PlatformControllerBuilder} from "./builder/PlatformControllerBuilder";
import {ControllerProvider} from "./domain/ControllerProvider";
import {Route} from "./interfaces/Route";
import {Platform} from "./services/Platform";
import {PlatformRouter} from "./services/PlatformRouter";

/**
 * @ignore
 */
@Module({
  imports: [InjectorService, Platform]
})
export class PlatformModule {
  constructor(protected injector: InjectorService, protected platform: Platform) {
    this.createRoutersFromControllers();
  }

  /**
   * Create routers from the collected controllers
   */
  public createRoutersFromControllers() {
    const {injector} = this;

    return injector
      .getProviders(ProviderType.CONTROLLER)
      .map((provider: ControllerProvider) => {
        provider.setRouter(PlatformRouter.create(injector, provider.routerOptions));

        if (!provider.hasParent()) {
          return new PlatformControllerBuilder(provider as ControllerProvider).build(injector);
        }
      })
      .filter(Boolean);
  }

  public $$loadRoutes() {
    const routes = this.injector.settings.get<Route[]>("routes");

    this.platform.addRoutes(routes);
  }
}
