import {Metadata} from "./Metadata.js";

function logger(target: any, method?: any, descriptor?: any) {
  return descriptor;
}

@logger
class Test {
  @logger
  attribut: string = "";

  // tslint:disable-next-line: no-unused-variable
  constructor(private type?: string) {}

  static methodStatic() {}

  @logger
  method(type: string): boolean {
    return true;
  }
}

class Test2 {
  attribut: any;

  constructor() {}

  static methodStatic() {}

  method() {}
}

describe("Metadata", () => {
  describe("has", () => {
    it("should return false (String)", () => {
      expect(Metadata.has("testunknow", String)).toBe(false);
    });

    it("should return false (bad target)", () => {
      expect(Metadata.has("testunknow", undefined)).toBe(false);
    });
  });

  describe("set", () => {
    it("should set meta on a class", () => {
      expect(Metadata.set("metadatakey1", "test1", Test)).toBeUndefined();
      expect(Metadata.has("metadatakey1", Test)).toBe(true);
    });

    it("should set meta on instance", () => {
      expect(Metadata.set("metadatakey2", "test2", new Test())).toBeUndefined();
      expect(Metadata.has("metadatakey2", Test)).toBe(true);
    });

    it("should set meta on a method", () => {
      expect(Metadata.set("metadatakey3", "test1", Test, "method")).toBeUndefined();
      expect(Metadata.has("metadatakey3", Test, "method")).toBe(true);
    });
  });

  describe("get", () => {
    it("should get meta on a class", () => {
      expect(Metadata.get("metadatakey1", Test)).toBe("test1");
    });

    it("should get meta on a method", () => {
      expect(Metadata.get("metadatakey3", Test, "method")).toBe("test1");
    });
  });

  describe("getOwn", () => {
    it("should get meta on a class", () => {
      expect(Metadata.getOwn("metadatakey1", Test)).toBe("test1");
    });

    it("should get meta on a method", () => {
      expect(Metadata.getOwn("metadatakey3", Test, "method")).toBe("test1");
    });
  });

  describe("delete", () => {
    it("should remove meta on a class", () => {
      expect(Metadata.delete("metadatakey1", Test)).toBe(true);
    });
  });

  describe("getType", () => {
    it("should return attribut type", () => {
      expect(Metadata.getType(Test.prototype, "attribut")).toBe(String);
    });
  });

  describe("getOwnType", () => {
    it("should return attribut type", () => {
      expect(Metadata.getOwnType(Test.prototype, "attribut")).toBe(String);
    });
  });

  describe("getParamTypes", () => {
    it("should return types on constructor", () => {
      expect(Metadata.getParamTypes(Test)).toBeInstanceOf(Array);
      expect(Metadata.getParamTypes(Test)[0]).toBe(String);
    });

    it("should return types on method", () => {
      expect(Metadata.getParamTypes(Test.prototype, "method")).toBeInstanceOf(Array);
      expect(Metadata.getParamTypes(Test.prototype, "method")[0]).toBe(String);
    });
  });

  describe("getOwnParamTypes", () => {
    it("should return types on constructor", () => {
      expect(Metadata.getOwnParamTypes(Test)).toBeInstanceOf(Array);
      expect(Metadata.getOwnParamTypes(Test)[0]).toBe(String);
    });

    it("should return types on method", () => {
      expect(Metadata.getOwnParamTypes(Test.prototype, "method")).toBeInstanceOf(Array);
      expect(Metadata.getOwnParamTypes(Test.prototype, "method")[0]).toBe(String);
    });
  });

  describe("list", () => {
    it("should return unique provide from property key", () => {
      Metadata.set("controller", "test", Test);
      Metadata.set("controller", "test2", Test2);
      Metadata.set("controller", "test", Test);

      const result = Metadata.getTargetsFromPropertyKey("controller");

      expect(result).toBeInstanceOf(Array);
      // expect(result.length).to.equal(2);
      expect(result.indexOf(Test) > -1).toBe(true);
      expect(result.indexOf(Test2) > -1).toBe(true);

      const result2 = Metadata.getTargetsFromPropertyKey("controller2");

      expect(result2).toBeInstanceOf(Array);
      expect(result2.length).toBe(0);
    });
  });
});
