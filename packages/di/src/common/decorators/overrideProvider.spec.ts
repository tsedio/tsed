import {Provider} from "../domain/Provider.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";
import {OverrideProvider} from "./overrideProvider.js";

describe("OverrideProvider", () => {
  class Test {}

  class Test2 {}

  beforeAll(() => {
    vi.spyOn(Provider.Registry, "get");
  });
  it("should use OverrideProvider", () => {
    // GIVEN
    const provider = new Provider(Test);

    vi.mocked(Provider.Registry.get).mockImplementation((token: TokenProvider) => {
      if (token === Test) {
        return provider;
      }
    });
    // WHEN
    OverrideProvider(Test)(Test2);

    // THEN
    expect(provider.token).toEqual(Test);
    expect(provider.useClass).toEqual(Test2);
  });
});
