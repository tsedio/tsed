import {GlobalProviders} from "./GlobalProviders.js";
import {registerProvider} from "./ProviderRegistry.js";

describe("ProviderRegistry", () => {
  describe("registerProvider()", () => {
    beforeEach(() => {
      vi.spyOn(GlobalProviders, "merge");
      vi.spyOn(GlobalProviders, "has").mockReturnValue(false);
    });
    afterEach(() => {
      vi.resetAllMocks();
    });

    it("should add provider", () => {
      class Test {}

      registerProvider({provide: Test});

      expect(GlobalProviders.merge).toHaveBeenCalledWith(Test, {
        provide: Test
      });
    });
  });
});
