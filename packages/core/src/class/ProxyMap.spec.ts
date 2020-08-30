import {expect} from "chai";
import {ProxyMap} from "@tsed/core";

class MapImpl extends ProxyMap<any, any> {}

class MapFilteredImpl extends ProxyMap<any, any> {
  constructor(map: any) {
    super(map, {filter: {type: "type1"}});
  }
}

describe("ProxyMap", () => {
  describe("without filtering", () => {
    let service: any;
    before(() => {
      const initialMap = new Map();
      initialMap.set("test", "testValue");

      service = new MapImpl(initialMap);
    });

    describe("set()", () => {
      before(() => {
        service.set("test2", "test2");
      });
      after(() => {
        service.delete("test2");
      });
      it("should add a element", () => {
        expect(service.size).to.equal(2);
      });
    });

    describe("has()", () => {
      it("should return true", () => {
        expect(service.has("test")).to.be.true;
      });

      it("should return false", () => {
        expect(service.has("any")).to.be.false;
      });
    });

    describe("get()", () => {
      it("should return element", () => {
        expect(service.get("test")).to.eq("testValue");
      });

      it("should return undefined", () => {
        expect(service.get("any")).to.be.undefined;
      });
    });

    describe("forEach()", () => {
      it("should return the list", () => {
        const list = [];
        service.forEach((item: any) => {
          list.push(item);
        });
        expect(list.length).to.eq(service.size);
      });
    });

    describe("keys()", () => {
      it("should return the list", () => {
        const list = Array.from(service.keys());
        expect(list).to.deep.eq(["test"]);
      });
    });

    describe("entries()", () => {
      it("should return the list", () => {
        const list = Array.from(service.entries());
        expect(list).to.deep.eq([["test", "testValue"]]);
      });
    });

    describe("values()", () => {
      it("should return the list", () => {
        const list = Array.from(service.values());
        expect(list).to.deep.eq(["testValue"]);
      });
    });

    describe("Array.from()", () => {
      it("should return a list", () => {
        const list = Array.from(service);
        expect(list).to.deep.eq([["test", "testValue"]]);
      });
    });

    describe("clear()", () => {
      it("should add a element", () => {
        let service: any;
        const initialMap = new Map();
        initialMap.set("test", "testValue");

        service = new MapImpl(initialMap);
        service.clear();
        expect(service.size).to.equal(0);
      });
    });
  });
  describe("with filtering", () => {
    let service: any;
    before(() => {
      const initialMap = new Map();
      initialMap.set("test", {type: "type1"});
      initialMap.set("test2", {type: "type2"});
      initialMap.set("test3", {type: "type1"});
      initialMap.set("test4", {type: "type4"});

      service = new MapFilteredImpl(initialMap);
    });

    describe("set()", () => {
      before(() => {
        service.set("test5", {type: "any"});
      });

      it("should add a element", () => {
        expect(service.has("test5")).to.be.false;
      });
    });

    describe("delete()", () => {
      it("should do nothing", () => {
        expect(service.delete("test")).to.be.false;
      });
    });

    describe("has()", () => {
      it("should return true", () => {
        expect(service.has("test")).to.be.true;
      });

      it("should return false", () => {
        expect(service.has("test2")).to.be.false;
      });
    });

    describe("get()", () => {
      it("should return element", () => {
        expect(service.get("test")).to.deep.eq({type: "type1"});
      });

      it("should return undefined", () => {
        expect(service.get("test2")).to.be.undefined;
      });
    });

    describe("forEach()", () => {
      it("should return the list", () => {
        const list = [];
        service.forEach((item: any) => {
          list.push(item);
        });
        expect(list.length).to.eq(2);
      });
    });

    describe("keys()", () => {
      it("should return the list", () => {
        expect(Array.from(service.keys())).to.deep.eq(["test", "test3"]);
      });
    });

    describe("values()", () => {
      it("should return the list", () => {
        expect(Array.from(service.values())).to.deep.eq([{type: "type1"}, {type: "type1"}]);
      });
    });

    describe("Array.from()", () => {
      it("should return a list", () => {
        expect(Array.from(service)).to.deep.eq([
          ["test", {type: "type1"}],
          ["test3", {type: "type1"}],
        ]);
      });
    });

    describe("clear()", () => {
      it("should add a element", () => {
        const initialMap = new Map();
        initialMap.set("test", {type: "type1"});
        initialMap.set("test2", {type: "type2"});
        initialMap.set("test3", {type: "type1"});
        initialMap.set("test4", {type: "type4"});

        const service = new MapFilteredImpl(initialMap);

        service.clear();
        expect(service.size).to.equal(2);
      });
    });
  });
});
