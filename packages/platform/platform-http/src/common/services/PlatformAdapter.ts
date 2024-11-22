import {Type} from "@tsed/core";
import {injectable, ProviderOpts} from "@tsed/di";
import {PlatformContextHandler, PlatformHandlerMetadata, PlatformLayer} from "@tsed/platform-router";
import {IncomingMessage, ServerResponse} from "http";

import {PlatformMulter, PlatformMulterSettings} from "../config/interfaces/PlatformMulterSettings.js";
import {PlatformStaticsOptions} from "../config/interfaces/PlatformStaticsSettings.js";
import {PlatformContext} from "../domain/PlatformContext.js";
import {application} from "../fn/application.js";
import {createHttpServer} from "../utils/createHttpServer.js";
import {createHttpsServer} from "../utils/createHttpsServer.js";
import {CreateServerReturn} from "../utils/createServer.js";
import type {PlatformApplication} from "./PlatformApplication.js";

export abstract class PlatformAdapter<App = TsED.Application> {
  static readonly NAME: string;
  /**
   * Load providers in top priority
   */
  providers: ProviderOpts[];

  get app(): PlatformApplication<App> {
    return application();
  }

  getServers(): CreateServerReturn[] {
    const app = application<App>();
    return [createHttpServer(app.callback()), createHttpsServer(app.callback())].filter(Boolean) as any[];
  }

  onInit(): Promise<void> | void {
    return Promise.resolve();
  }

  beforeLoadRoutes(): Promise<void> | void {
    return Promise.resolve();
  }

  afterLoadRoutes(): Promise<void> | void {
    return Promise.resolve();
  }

  /**
   * create initial context
   */
  abstract useContext(): any;

  /**
   * Map router layer to the targeted framework
   */
  abstract mapLayers(layer: PlatformLayer[]): void;

  /**
   * Map handler to the targeted framework
   */
  abstract mapHandler(handler: Function, layer: PlatformHandlerMetadata): Function;

  /**
   * Return the app instance
   */
  abstract createApp(): {app: App; callback(): (req: IncomingMessage, res: ServerResponse) => void};

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

export class FakeAdapter extends PlatformAdapter<any> {
  providers: ProviderOpts[] = [];
  static readonly NAME: string = "FAKE_ADAPTER";

  static createFakeRawDriver() {
    // istanbul ignore next
    function FakeRawDriver() {}

    // istanbul ignore next
    function use() {
      return this;
    }

    FakeRawDriver.use = use;
    FakeRawDriver.all = use;
    FakeRawDriver.get = use;
    FakeRawDriver.patch = use;
    FakeRawDriver.post = use;
    FakeRawDriver.put = use;
    FakeRawDriver.head = use;
    FakeRawDriver.delete = use;
    FakeRawDriver.options = use;

    return FakeRawDriver;
  }

  createApp(): {app: any; callback(): any} {
    const app = FakeAdapter.createFakeRawDriver();
    return {
      app,
      callback() {
        return app;
      }
    };
  }

  multipart(options: PlatformMulterSettings): PlatformMulter {
    return {} as any;
  }

  statics(endpoint: string, options: PlatformStaticsOptions): any {
    return {};
  }

  bodyParser(type: string): any {
    return () => {};
  }

  mapLayers(layers: PlatformLayer[]) {}

  mapHandler(handler: PlatformContextHandler<PlatformContext>) {
    return handler;
  }

  useContext() {}
}

injectable(PlatformAdapter).class(FakeAdapter);
