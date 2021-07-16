import {InjectorService, Module, ProviderType} from "@tsed/di";
import {ConverterService} from "../mvc";
import {ControllerProvider} from "./domain/ControllerProvider";
import {Platform} from "./services/Platform";
import {PlatformRouter} from "./services/PlatformRouter";

/**
 * @ignore
 */
@Module({
  imports: [InjectorService, ConverterService, Platform]
})
export class PlatformModule {
  constructor(protected injector: InjectorService, protected platform: Platform) {
    this.createRoutersFromControllers();
  }

  /**
   * Create routers from the collected controllers
   */
  private createRoutersFromControllers() {
    const {injector} = this;

    return injector.getProviders(ProviderType.CONTROLLER).map((provider: ControllerProvider) => {
      const router = injector.invoke<PlatformRouter>(PlatformRouter);
      provider.setRouter(router);
    });
  }
}
