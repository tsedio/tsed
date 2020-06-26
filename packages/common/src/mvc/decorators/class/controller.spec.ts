import {expect} from "chai";
import {GlobalProviders, ProviderScope, ProviderType} from "../../../../../di/src";
import {Controller} from "../../../../src/mvc";

class Test {}

class Dep {}

describe("@Controller", () => {
  after(() => {
    GlobalProviders.delete(Test);
  });
  it("should register a controller with his path and Dependency", () => {
    // WHEN
    Controller("/test", Dep)(Test);

    // THEN
    const provider = GlobalProviders.get(Test)!;

    // THEN
    expect(provider.type).to.equal(ProviderType.CONTROLLER);
    expect(provider.path).to.equal("/test");
    expect(provider.children).to.deep.equal([Dep]);
  });

  it("should register a controller with customer provider options", () => {
    // WHEN
    Controller({
      path: "/test",
      children: [Dep],
      scope: ProviderScope.REQUEST
    })(Test);

    // THEN
    const provider = GlobalProviders.get(Test)!;

    // THEN
    expect(provider.type).to.equal(ProviderType.CONTROLLER);
    expect(provider.scope).to.equal(ProviderScope.REQUEST);
    expect(provider.path).to.equal("/test");
    expect(provider.children).to.deep.equal([Dep]);
  });
});
