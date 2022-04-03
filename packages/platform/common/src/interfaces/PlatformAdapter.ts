import {Type} from "@tsed/core";
import {ProviderOpts} from "@tsed/di";

export interface PlatformAdapter<App = TsED.Application, Router = TsED.Router> {
  /**
   * Load providers in top priority
   */
  readonly providers: ProviderOpts[];
  /**
   * Called after the injector instantiation
   */
  onInit?: () => any;
  beforeLoadRoutes?: () => Promise<any>;
  afterLoadRoutes?: () => Promise<any>;
  useRouter?: () => any;
  useContext?: () => any;
}

export interface PlatformBuilderSettings<App = TsED.Application, Router = TsED.Router> extends Partial<TsED.Configuration> {
  adapter?: Type<PlatformAdapter<App, Router>>;
}
