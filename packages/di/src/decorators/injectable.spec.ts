import {Injectable} from "@tsed/di";
import * as ProviderRegistry from "../../src/registries/ProviderRegistry";

describe("@Injectable()", () => {
  beforeEach(() => jest.spyOn(ProviderRegistry, "registerProvider"));
  afterEach(() => jest.resetAllMocks());

  it("should call `registerProvider` setting `provide` according to the target class", () => {
    // GIVEN
    class Test {}

    // WHEN
    Injectable()(Test);

    // THEN
    expect(ProviderRegistry.registerProvider).toBeCalledWith({
      provide: Test
    });
  });

  it("should call `registerProvider` passing an additional options", () => {
    // GIVEN
    class Test {}

    // WHEN
    Injectable({options: "options"})(Test);

    // THEN
    expect(ProviderRegistry.registerProvider).toBeCalledWith({
      options: "options",
      provide: Test
    });
  });

  it("should override `provide`", () => {
    // GIVEN
    class Test {}
    const provide = "custom";

    // WHEN
    Injectable({provide})(Test);

    // THEN
    expect(ProviderRegistry.registerProvider).toBeCalledWith({
      provide,
      useClass: Test
    });
  });
});
