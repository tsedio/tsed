import {Provider} from "../domain/Provider.js";
import {ProviderScope} from "../domain/ProviderScope.js";
import {ProviderType} from "../domain/ProviderType.js";
import {Controller} from "./controller.js";

class Test {}

class Dep {}

describe("@Controller", () => {
  afterAll(() => {
    Provider.Registry.delete(Test);
  });
  it("should register a controller with his path and Dependency", () => {
    // WHEN
    Controller("/test")(Test);

    // THEN
    const provider = Provider.Registry.get(Test)!;

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
    const provider = Provider.Registry.get(Test)!;

    // THEN
    expect(provider.type).toEqual(ProviderType.CONTROLLER);
    expect(provider.scope).toEqual(ProviderScope.REQUEST);
    expect(provider.path).toEqual("/test");
    expect(provider.children).toEqual([Dep]);
  });
});
