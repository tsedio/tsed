import {ProviderScope} from "../domain/ProviderScope.js";
import {ProviderType} from "../domain/ProviderType.js";
import {GlobalProviders} from "./GlobalProviders.js";
import {registerProvider, registerValue} from "./ProviderRegistry.js";

describe("ProviderRegistry", () => {
  describe("registerProvider()", () => {
    beforeEach(() => {
      jest.spyOn(GlobalProviders, "merge");
      jest.spyOn(GlobalProviders, "has").mockReturnValue(false);
    });
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should throw an error when provide field is not given ", () => {
      // GIVEN
      let actualError;
      try {
        registerProvider({provide: undefined});
      } catch (er) {
        actualError = er;
      }

      expect(actualError.message).toEqual("Provider.provide is required");
    });

    it("should add provider", () => {
      class Test {}

      registerProvider({provide: Test});

      expect(GlobalProviders.merge).toBeCalledWith(Test, {
        provide: Test
      });
    });
  });
  describe("registerValue()", () => {
    beforeEach(() => {
      jest.spyOn(GlobalProviders, "merge");
      jest.spyOn(GlobalProviders, "has").mockReturnValue(false);
    });
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should add provider (1)", () => {
      const token = Symbol.for("CustomTokenValue");

      registerValue(token, "myValue");

      expect(GlobalProviders.merge).toBeCalledWith(token, {
        provide: token,
        useValue: "myValue",
        scope: ProviderScope.SINGLETON,
        type: ProviderType.VALUE
      });
    });

    it("should add provider", () => {
      const token = Symbol.for("CustomTokenValue");

      registerValue({provide: token, useValue: "myValue", scope: ProviderScope.REQUEST});

      expect(GlobalProviders.merge).toBeCalledWith(token, {
        provide: token,
        useValue: "myValue",
        scope: ProviderScope.REQUEST,
        type: ProviderType.VALUE
      });
    });

    it("should add provider (legacy)", () => {
      const token = Symbol.for("CustomTokenValue2");

      registerValue(token, "myValue");

      expect(GlobalProviders.merge).toBeCalledWith(token, {
        provide: token,
        useValue: "myValue",
        scope: ProviderScope.SINGLETON,
        type: ProviderType.VALUE
      });
    });
  });
});
