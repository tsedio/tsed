import {expect} from "chai";
import {ProxyRegistry, Registry} from "../../src";

class FakeMetadata {
  attr1: any;
  attr2: any;

  constructor(public target: any) {
  }

  test() {
    return this.target;
  }
}

describe("ProxyRegistry", () => {
  before(() => {
    this.proxy = class extends ProxyRegistry<any, any> {
      invoke(target: any, locals?: Map<Function, any>, designParamTypes?: any[]): any {
        return null;
      }
    };
    this.registry = new Registry(FakeMetadata);
    this.service = new this.proxy(this.registry);
  });

  describe("set", () => {
    before(() => {
      this.clazz = class {
      };
    });
    it("should add a metadata", () => {
      this.service.set(this.clazz, {});
      expect(this.service.size).to.equal(1);
    });
  });

  describe("has", () => {
    before(() => {
      this.clazz = class {
      };
    });
    it("should add a metadata", () => {
      this.service.set(this.clazz, {});
      expect(this.service.size).to.equal(2);
    });
    it("should return true if class is known", () => {
      expect(this.service.has(this.clazz)).to.be.true;
    });
    it("should return false if class is unknown", () => {
      expect(this.service.has(class {
      })).to.be.false;
    });
  });

  describe("get", () => {
    before(() => {
      this.clazz = class {
      };
    });
    it("should add a metadata", () => {
      this.service.set(this.clazz, {test: true});
      expect(this.service.size).to.equal(3);
    });
    it("should get metadata", () => {
      expect(this.service.get(this.clazz).test).to.be.true;
    });
  });

  describe("forEach", () => {
    before(() => {
      this.clazz = class {
      };
    });
    it("should add a metadata", () => {
      this.service.set(this.clazz, {test: true});
      expect(this.service.size).to.equal(4);
    });

    it("should loop for each item stored in service", () => {
      const o: any = [];
      this.service.forEach((e: any) => o.push(e));
      expect(o.length).to.equal(4);
    });
  });
});
