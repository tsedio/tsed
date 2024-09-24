import {Provider} from "./Provider.js";
import {ProviderScope} from "./ProviderScope.js";

class T1 {}

class T2 {}

const S1 = Symbol.for("S1");

describe("Provider", () => {
  describe("when is a class", () => {
    it("should wrap the token provided", () => {
      const provider = new Provider(T1);
      provider.scope = ProviderScope.REQUEST;
      provider.customProp = "test";

      expect(provider.provide).toEqual(T1);
      expect(provider.useClass).toEqual(T1);
      expect(!!provider.store).toEqual(true);
      expect(provider.clone()).toEqual(provider);
    });

    it("should override the token provider", () => {
      const provider = new Provider(T1);
      provider.scope = ProviderScope.REQUEST;
      provider.customProp = "test";
      provider.useClass = T2;

      const cloned = provider.clone();

      expect(provider.provide).toEqual(T1);
      expect(provider.useClass).toEqual(T2);
      expect(!!provider.store).toEqual(true);
      expect(cloned.useClass).toEqual(T2);
      expect(cloned.scope).toEqual(ProviderScope.REQUEST);
      expect(provider.hasChildren()).toEqual(false);
      expect(provider.hasParent()).toEqual(false);
    });
  });

  describe("when is a symbol", () => {
    it("should wrap the token provided", () => {
      const provider = new Provider(S1);

      expect(provider.provide).toEqual(S1);
      expect(!!provider.useClass).toEqual(false);
      expect(!!provider.store).toEqual(true);
    });
  });

  describe("when is a string", () => {
    it("should wrap the token provided", () => {
      const provider = new Provider("test");

      expect(provider.provide).toEqual("test");
      expect(!!provider.useClass).toEqual(false);
      expect(!!provider.store).toEqual(true);
    });
  });

  describe("clone()", () => {
    it("should clone a provider", () => {
      const provider = new Provider(T1);
      provider.type = "provider";
      provider.scope = ProviderScope.REQUEST;
    });
  });

  describe("className", () => {
    it("should return the class name", () => {
      expect(new Provider(T1).className).toEqual("T1");
    });

    it("should return the symbol name", () => {
      expect(new Provider(S1).className).toEqual("S1");
    });
  });

  describe("name", () => {
    it("should return the class name", () => {
      expect(new Provider(T1).name).toEqual("T1");
    });
  });
  describe("path", () => {
    it("should return set the path", () => {
      const provider = new Provider(T1);
      provider.path = "path";
      expect(provider.path).toEqual("path");
    });
  });

  describe("toString()", () => {
    it("should return the class name", () => {
      expect(new Provider(T1).toString()).toEqual("Token:T1:T1");
    });
  });

  describe("isAsync()", () => {
    it("should return true", () => {
      const provider = new Provider(T1);
      provider.useAsyncFactory = () => Promise.resolve("test");

      expect(provider.isAsync()).toEqual(true);
    });
  });
});
