import {FakeAdapter} from "../../../testing/index.js";
import {PlatformBuilder} from "../PlatformBuilder.js";
import {Type} from "@tsed/core";

export class PlatformCustom extends FakeAdapter {
  readonly NAME = "custom";
  readonly providers = [
    {
      token: class Test {}
    }
  ];

  static create(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return new PlatformBuilder({
      rootModule: module,
      httpPort: false,
      httpsPort: false,
      ...settings,
      adapter: PlatformCustom
    });
  }

  static bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return new PlatformBuilder({
      rootModule: module,
      ...settings,
      adapter: PlatformCustom
    }).bootstrap();
  }

  afterLoadRoutes(): Promise<any> {
    return Promise.resolve(undefined);
  }

  beforeLoadRoutes(): Promise<any> {
    return Promise.resolve(undefined);
  }

  useContext(): any {}

  useRouter(): any {}
}
