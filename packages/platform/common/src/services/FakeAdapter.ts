import {ProviderOpts} from "@tsed/di";
import {PlatformAdapter} from "./PlatformAdapter";
import {PlatformMulter, PlatformMulterSettings} from "../config/interfaces/PlatformMulterSettings";
import {PlatformStaticsOptions} from "../config/interfaces/PlatformStaticsSettings";

export class FakeAdapter implements PlatformAdapter<any, any> {
  providers: ProviderOpts[] = [];

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

  app(): {app: any; callback(): any} {
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

  router(routerOptions: any): {router: any; callback(): any} {
    const router = FakeAdapter.createFakeRawDriver();
    return {
      router,
      callback() {
        return router;
      }
    };
  }

  statics(endpoint: string, options: PlatformStaticsOptions): any {
    return {};
  }
}
