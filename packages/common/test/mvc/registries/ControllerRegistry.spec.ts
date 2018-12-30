import {GlobalProviders} from "@tsed/di";
import {expect} from "chai";
import {ProviderType} from "../../../../di/src/interfaces";
import {ControllerProvider, ExpressRouter} from "../../../src/mvc";

describe("ControllerRegistry", () => {
  class Test {
  }

  before(() => {
    const settings = GlobalProviders.getRegistrySettings(ProviderType.CONTROLLER);

    this.locals = new Map();
    this.provider = new ControllerProvider(Test);
    this.provider.router = "router";
    settings.onInvoke!(this.provider, this.locals, []);
  });

  it("should store ExpressRouter", () => {
    expect(this.locals.has(ExpressRouter)).to.eq(true);
  });

  it("should return ExpressRouter", () => {
    expect(this.locals.get(ExpressRouter)).to.eq("router");
  });
});
