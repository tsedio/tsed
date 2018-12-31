import {expect} from "chai";
import {Provider} from "../../src/class/Provider";

class T1 {}

class T2 {}

const S1 = Symbol.for("S1");
const S2 = Symbol.for("S2");

describe("Provider", () => {
  describe("className", () => {
    it("should return the class name", () => {
      expect(new Provider(T1).className).to.eq("T1");
    });

    it("should return the symbol name", () => {
      expect(new Provider(S1).className).to.eq("S1");
    });
  });

  describe("provide", () => {
    it("should equal to the class provided", () => {
      expect(new Provider(T2).provide).to.equal(T2);
    });

    it("should equal to the symbol provided", () => {
      expect(new Provider(S2).provide).to.equal(S2);
    });
  });

  describe("useClass", () => {
    it("should not equal to the class provided", () => {
      expect(new Provider(class {}).provide).not.to.equal(T2);
    });
  });

  describe("instance", () => {
    it("should have an instance", () => {
      const provider = new Provider(T1);
      provider.useClass = T2;
      provider.instance = new provider.useClass();
      expect(provider.instance).instanceOf(T2);
    });
  });

  describe("type", () => {
    it("should set a type of provider", () => {
      const provider = new Provider(T1);
      provider.type = "typeTest";
      expect(provider.type).to.equal("typeTest");
    });
  });
});
