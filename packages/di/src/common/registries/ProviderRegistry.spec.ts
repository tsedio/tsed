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

    it("should add provider (token)", () => {
      class Test {}

      registerProvider({token: Test});

      expect(GlobalProviders.merge).toHaveBeenCalledWith(Test, {
        token: Test,
        global: true
      });
    });

    it("should add provider (provide)", () => {
      class Test {}

      registerProvider({provide: Test});

      expect(GlobalProviders.merge).toHaveBeenCalledWith(Test, {
        token: Test,
        global: true
      });
    });
  });
});
