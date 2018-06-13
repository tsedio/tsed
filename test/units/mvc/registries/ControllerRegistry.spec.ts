import {ControllerProvider, ExpressRouter, GlobalProviders, ProviderType, RouterController} from "@tsed/common";
import {expect} from "../../../tools";

describe("ControllerRegistry", () => {
  class Test {}

  before(() => {
    const settings = GlobalProviders.getRegistrySettings(ProviderType.CONTROLLER);

    this.locals = new Map();
    this.provider = new ControllerProvider(Test);
    this.provider.router = "router";
    settings.onInvoke!(this.provider, this.locals, []);
  });

  it("should store RouterController (deprecated)", () => {
    expect(this.locals.has(RouterController)).to.eq(true);
  });

  it("should store ExpressRouter", () => {
    expect(this.locals.has(ExpressRouter)).to.eq(true);
  });

  it("should return ExpressRouter", () => {
    expect(this.locals.get(ExpressRouter)).to.eq("router");
  });
});
