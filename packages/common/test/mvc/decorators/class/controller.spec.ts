import {GlobalProviders, ProviderScope, ProviderType} from "../../../../../di/src";
import {Controller} from "../../../../src/mvc";

class Test {
}

class Dep {
}

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
    provider.type.should.equal(ProviderType.CONTROLLER);
    provider.path.should.equal("/test");
    provider.children.should.deep.equal([Dep]);
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
    provider.type.should.equal(ProviderType.CONTROLLER);
    provider.scope.should.equal(ProviderScope.REQUEST);
    provider.path.should.equal("/test");
    provider.children.should.deep.equal([Dep]);
  });
});
