import {expect} from "chai";
import {getKeys} from "../../../core/src/utils";
import {Provider} from "../../src/class/Provider";
import {ProviderScope} from "../../src/interfaces";

class T1 {
}

const S1 = Symbol.for("S1");

describe("Provider", () => {
  describe("when is a class", () => {
    it("should wrap the token provided", () => {
      const provider = new Provider(T1);
      provider.scope = ProviderScope.REQUEST;
      provider.customProp = "test";

      expect(provider.provide).to.eq(T1);
      expect(provider.useClass).to.eq(T1);
      expect(!!provider.store).to.eq(true);
      expect(getKeys(provider)).to.deep.eq([
        "root",
        "type",
        "injectable",
        "customProp",
        "useClass",
        "scope",
        "configuration",
        "instance",
        "deps",
        "imports",
        "useFactory",
        "useAsyncFactory",
        "useValue"
      ]);
      expect(provider.clone()).to.deep.eq(provider);
    });
  });

  describe("when is a symbol", () => {
    it("should wrap the token provided", () => {
      const provider = new Provider(S1);

      expect(provider.provide).to.eq(S1);
      expect(!!provider.useClass).to.eq(false);
      expect(!!provider.store).to.eq(true);
    });
  });

  describe("when is a string", () => {
    it("should wrap the token provided", () => {
      const provider = new Provider("test");

      expect(provider.provide).to.eq("test");
      expect(!!provider.useClass).to.eq(false);
      expect(!!provider.store).to.eq(true);
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
      expect(new Provider(T1).className).to.eq("T1");
    });

    it("should return the symbol name", () => {
      expect(new Provider(S1).className).to.eq("S1");
    });
  });

  describe("name", () => {
    it("should return the class name", () => {
      expect(new Provider(T1).name).to.eq("T1");
    });
  });

  describe("toString()", () => {
    it("should return the class name", () => {
      expect(new Provider(T1).toString()).to.eq("Token:T1");
    });
  });

  describe("isAsync()", () => {
    it("should return true", () => {
      const provider = new Provider(T1);
      provider.useAsyncFactory = async () => "test";

      expect(provider.isAsync()).to.eq(true);
    });
  });
});
