import {Controller} from "@tsed/common";
import {GlobalProviders, ProviderScope, ProviderType} from "@tsed/di";

class Test {}

class Dep {}

describe("@Controller", () => {
  afterAll(() => {
    GlobalProviders.delete(Test);
  });
  it("should register a controller with his path and Dependency", () => {
    // WHEN
    Controller("/test")(Test);

    // THEN
    const provider = GlobalProviders.get(Test)!;

    // THEN
    expect(provider.type).toEqual(ProviderType.CONTROLLER);
    expect(provider.path).toEqual("/test");
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
    expect(provider.type).toEqual(ProviderType.CONTROLLER);
    expect(provider.scope).toEqual(ProviderScope.REQUEST);
    expect(provider.path).toEqual("/test");
    expect(provider.children).toEqual([Dep]);
  });
});