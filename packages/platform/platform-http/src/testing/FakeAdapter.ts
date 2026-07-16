import {type PlatformContextHandler, PlatformLayer} from "@tsed/platform-router";
import {type ProviderOpts, injectable} from "@tsed/di";
import {PlatformContext} from "../common/domain/PlatformContext.js";
import {type PlatformStaticsOptions} from "../common/config/PlatformStaticsSettings.js";
import {PlatformAdapter} from "../common/services/PlatformAdapter.js";

export class FakeAdapter extends PlatformAdapter<any> {
  readonly NAME: string = "FAKE_ADAPTER";
  providers: ProviderOpts[] = [];

  static createFakeRawDriver() {
    // istanbul ignore next
    function FakeRawDriver() {}

    // istanbul ignore next
    function use(this: any) {
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

  multipart(options: TsED.MultipartFileOptions): TsED.MultipartFileInstance {
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
