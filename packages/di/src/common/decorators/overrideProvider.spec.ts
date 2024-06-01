import {Provider} from "../domain/Provider.js";
import {GlobalProviders} from "../registries/GlobalProviders.js";
import {OverrideProvider} from "./overrideProvider.js";

describe("OverrideProvider", () => {
  class Test {}

  class Test2 {}

  beforeAll(() => {
    jest.spyOn(GlobalProviders, "get");
  });
  it("should use OverrideProvider", () => {
    // GIVEN
    const provider = new Provider(Test);

    jest.mocked(GlobalProviders.get).mockImplementation((token: object) => {
      if (token === Test) {
        return provider;
      }
    });
    // WHEN
    OverrideProvider(Test)(Test2);

    // THEN
    expect(provider.provide).toEqual(Test);
    expect(provider.useClass).toEqual(Test2);
  });
});
