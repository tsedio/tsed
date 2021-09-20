import {ControllerProvider, PlatformRouter} from "@tsed/common";
import {GlobalProviders, ProviderType} from "@tsed/di";
import {expect} from "chai";

describe("ControllerRegistry", () => {
  class Test {}
  it("should create registry with the right parameters", () => {
    const settings = GlobalProviders.getRegistrySettings(ProviderType.CONTROLLER);

    const locals = new Map();
    const provider = new ControllerProvider(Test);
    // @ts-ignore
    provider.router = {
      raw: {}
    } as any;

    settings.onInvoke!(provider, locals, []);

    expect(locals.has(PlatformRouter)).to.eq(true);
    expect(locals.get(PlatformRouter)).to.deep.eq(provider.getRouter());
  });
});
