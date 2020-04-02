import {expect} from "chai";
import {ProxyRegistry, Registry} from "@tsed/core";

class FakeMetadata {
  attr1: any;
  attr2: any;

  constructor(public target: any) {}

  test() {
    return this.target;
  }
}

describe("ProxyRegistry", () => {
  let service: any;
  let proxy: any;
  let registry: any;
  before(() => {
    proxy = class extends ProxyRegistry<any, any> {
      invoke(target: any, locals?: Map<Function, any>, designParamTypes?: any[]): any {
        return null;
      }
    };
    registry = new Registry(FakeMetadata);
    service = new proxy(registry);
  });

  describe("set", () => {
    before(() => {});
    it("should add a metadata", () => {
      const clazz = class {};
      service.set(clazz, {});
      expect(service.size).to.equal(1);
    });
  });

  describe("has", () => {
    const clazz = class {};
    before(() => {
      service.set(clazz, {});
    });
    it("should add a metadata", () => {
      expect(service.size).to.equal(2);
    });
    it("should return true if class is known", () => {
      expect(service.has(clazz)).to.be.true;
    });
    it("should return false if class is unknown", () => {
      expect(service.has(class {})).to.be.false;
    });
  });

  describe("get", () => {
    const clazz = class {};
    it("should add a metadata", () => {
      service.set(clazz, {test: true});
      expect(service.size).to.equal(3);
    });
    it("should get metadata", () => {
      expect(service.get(clazz).test).to.be.true;
    });
  });

  describe("forEach", () => {
    const clazz = class {};
    it("should add a metadata", () => {
      service.set(clazz, {test: true});
      expect(service.size).to.equal(4);
    });

    it("should loop for each item stored in service", () => {
      const o: any = [];
      service.forEach((e: any) => o.push(e));
      expect(o.length).to.equal(4);
    });
  });
});
