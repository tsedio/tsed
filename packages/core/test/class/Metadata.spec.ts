import {expect} from "chai";
import {Metadata} from "../../src";

function logger(target: any, method?: any, descriptor?: any) {
  return descriptor;
}

@logger
class Test {
  @logger
  attribut: string = "";

  // tslint:disable-next-line: no-unused-variable
  constructor(private type?: string) {
  }

  static methodStatic() {
  }

  @logger
  method(type: string): boolean {
    return true;
  }
}

class Test2 {
  attribut: any;

  constructor() {
  }

  static methodStatic() {
  }

  method() {
  }
}

describe("Metadata", () => {
  describe("has", () => {
    it("should return false (String)", () => {
      expect(Metadata.has("testunknow", String)).to.equal(false);
    });

    it("should return false (bad target)", () => {
      expect(Metadata.has("testunknow", undefined)).to.equal(false);
    });
  });

  describe("set", () => {
    it("should set meta on a class", () => {
      expect(Metadata.set("metadatakey1", "test1", Test)).to.equal(undefined);
      expect(Metadata.has("metadatakey1", Test)).to.be.true;
    });

    it("should set meta on instance", () => {
      expect(Metadata.set("metadatakey2", "test2", new Test())).to.equal(undefined);
      expect(Metadata.has("metadatakey2", Test)).to.be.true;
    });

    it("should set meta on a method", () => {
      expect(Metadata.set("metadatakey3", "test1", Test, "method")).to.equal(undefined);
      expect(Metadata.has("metadatakey3", Test, "method")).to.be.true;
    });
  });

  describe("get", () => {
    it("should get meta on a class", () => {
      expect(Metadata.get("metadatakey1", Test)).to.equal("test1");
    });

    it("should get meta on a method", () => {
      expect(Metadata.get("metadatakey3", Test, "method")).to.equal("test1");
    });
  });

  describe("getOwn", () => {
    it("should get meta on a class", () => {
      expect(Metadata.getOwn("metadatakey1", Test)).to.equal("test1");
    });

    it("should get meta on a method", () => {
      expect(Metadata.getOwn("metadatakey3", Test, "method")).to.equal("test1");
    });
  });

  describe("delete", () => {
    it("should remove meta on a class", () => {
      expect(Metadata.delete("metadatakey1", Test)).to.equal(true);
    });
  });

  describe("getType", () => {
    it("should return attribut type", () => {
      expect(Metadata.getType(Test.prototype, "attribut")).to.equal(String);
    });
  });

  describe("getOwnType", () => {
    it("should return attribut type", () => {
      expect(Metadata.getOwnType(Test.prototype, "attribut")).to.equal(String);
    });
  });

  describe("getParamTypes", () => {
    it("should return types on constructor", () => {
      expect(Metadata.getParamTypes(Test)).to.be.an("array");
      expect(Metadata.getParamTypes(Test)[0]).to.equal(String);
    });

    it("should return types on method", () => {
      expect(Metadata.getParamTypes(Test.prototype, "method")).to.be.an("array");
      expect(Metadata.getParamTypes(Test.prototype, "method")[0]).to.equal(String);
    });
  });

  describe("getOwnParamTypes", () => {
    it("should return types on constructor", () => {
      expect(Metadata.getOwnParamTypes(Test)).to.be.an("array");
      expect(Metadata.getOwnParamTypes(Test)[0]).to.equal(String);
    });

    it("should return types on method", () => {
      expect(Metadata.getOwnParamTypes(Test.prototype, "method")).to.be.an("array");
      expect(Metadata.getOwnParamTypes(Test.prototype, "method")[0]).to.equal(String);
    });
  });

  describe("getReturnType", () => {
    it("should return types on method", () => {
      expect(Metadata.getReturnType(Test.prototype, "method")).to.equal(Boolean);
    });
  });

  describe("getOwnReturnType", () => {
    it("should return types on method", () => {
      expect(Metadata.getOwnReturnType(Test.prototype, "method")).to.equal(Boolean);
    });
  });

  describe("list", () => {
    it("should return unique provide from property key", () => {
      Metadata.set("controller", "test", Test);
      Metadata.set("controller", "test2", Test2);
      Metadata.set("controller", "test", Test);

      const result = Metadata.getTargetsFromPropertyKey("controller");

      expect(result).to.be.an("array");
      // expect(result.length).to.equal(2);
      expect(result.indexOf(Test) > -1).to.be.true;
      expect(result.indexOf(Test2) > -1).to.be.true;

      const result2 = Metadata.getTargetsFromPropertyKey("controller2");

      expect(result2).to.be.an("array");
      expect(result2.length).to.equal(0);
    });
  });
});
