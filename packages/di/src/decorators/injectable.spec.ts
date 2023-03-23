import {Injectable} from "../decorators/injectable";
import {GlobalProviders} from "../registries/GlobalProviders";
import * as ProviderRegistry from "../registries/ProviderRegistry";

describe("@Injectable()", () => {
  afterEach(() => jest.resetAllMocks());

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
