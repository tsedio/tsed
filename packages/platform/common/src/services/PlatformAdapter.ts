import {Type} from "@tsed/core";
import {InjectorService, ProviderOpts, registerProvider} from "@tsed/di";
import {PlatformHandlerMetadata, PlatformLayer} from "@tsed/platform-router";
import {IncomingMessage, ServerResponse} from "http";
import {PlatformMulter, PlatformMulterSettings} from "../config/interfaces/PlatformMulterSettings";
import {PlatformStaticsOptions} from "../config/interfaces/PlatformStaticsSettings";
import {FakeAdapter} from "./FakeAdapter";

export abstract class PlatformAdapter<App = TsED.Application> {
  static readonly NAME: string;
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
  /**
   * create initial context
   */
  abstract useContext: () => any;
  /**
   * Map router layer to the targeted framework
   */
  abstract mapLayers: (layer: PlatformLayer[]) => void;
  /**
   * Map handler to the targeted framework
   */
  abstract mapHandler: (handler: Function, layer: PlatformHandlerMetadata) => Function;

  /**
   * Return the app instance
   */
  abstract app(): {app: App; callback(): (req: IncomingMessage, res: ServerResponse) => void};

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

  /**
   * Return the body parser for the given
   * @param type
   * @param opts
   */
  abstract bodyParser(type: string, opts?: Record<string, any>): any;
}

export interface PlatformBuilderSettings<App = TsED.Application> extends Partial<TsED.Configuration> {
  adapter?: Type<PlatformAdapter<App>>;
}

registerProvider({
  provide: PlatformAdapter,
  deps: [InjectorService],
  useClass: FakeAdapter
});
