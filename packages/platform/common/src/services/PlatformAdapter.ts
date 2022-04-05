import {Type} from "@tsed/core";
import {InjectorService, ProviderOpts, registerProvider} from "@tsed/di";
import {PlatformMulter, PlatformMulterSettings} from "../config/interfaces/PlatformMulterSettings";
import {PlatformStaticsOptions} from "../config/interfaces/PlatformStaticsSettings";
import {RouterOptions} from "express";
import {FakeAdapter} from "./FakeAdapter";

export abstract class PlatformAdapter<App = TsED.Application, Router = TsED.Router> {
  /**
   * Load providers in top priority
   */
  providers: ProviderOpts[];
  /**
   * Called after the injector instantiation
   */
  onInit?: () => any;
  beforeLoadRoutes?: () => Promise<any>;
  afterLoadRoutes?: () => Promise<any>;
  useRouter?: () => any;
  useContext?: () => any;

  abstract app(): {app: App; callback(): any};

  abstract router(routerOptions?: Partial<RouterOptions>): {router: Router; callback(): any};
  /**
   * Return the statics middlewares
   * @param endpoint
   * @param options
   */
  abstract statics(endpoint: string, options: PlatformStaticsOptions): any;

  /**
   * Return the multipart middleware
   * @param options
   */
  abstract multipart(options: PlatformMulterSettings): PlatformMulter;
}

export interface PlatformBuilderSettings<App = TsED.Application, Router = TsED.Router> extends Partial<TsED.Configuration> {
  adapter?: Type<PlatformAdapter<App, Router>>;
}

registerProvider({
  provide: PlatformAdapter,
  deps: [InjectorService],
  useClass: FakeAdapter
});
