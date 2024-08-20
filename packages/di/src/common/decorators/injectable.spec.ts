import {Injectable} from "./injectable.js";
import {GlobalProviders} from "../registries/GlobalProviders.js";
import * as ProviderRegistry from "../registries/ProviderRegistry.js";

describe("@Injectable()", () => {
  afterEach(() => vi.resetAllMocks());

  it("should call `registerProvider` setting `provide` according to the target class", () => {
    // GIVEN
    class Test {}

    // WHEN
    Injectable()(Test);

    // THEN
    expect(GlobalProviders.get(Test)?.useClass).toEqual(Test);
  });

  it("should call `registerProvider` passing an additional options", () => {
    // GIVEN
    class Test {}

    // WHEN
    Injectable({options: "options"})(Test);

    // THEN
    expect(GlobalProviders.get(Test)?.useClass).toEqual(Test);
    expect(GlobalProviders.get(Test)?.options).toEqual("options");
  });

  it("should override `provide`", () => {
    // GIVEN
    class Test {}
    const provide = "custom";

    // WHEN
    Injectable({provide})(Test);

    // THEN
    expect(GlobalProviders.get("custom")?.useClass).toEqual(Test);
  });
});
