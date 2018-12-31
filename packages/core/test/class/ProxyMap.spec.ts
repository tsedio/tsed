import {expect} from "chai";
import {ProxyMap} from "../../src";

class MapImpl extends ProxyMap<any, any> {
}

class MapFilteredImpl extends ProxyMap<any, any> {
  constructor(map: any) {
    super(map, {filter: {type: "type1"}});
  }
}

describe("ProxyMap", () => {
  describe("without filtering", () => {
    before(() => {
      const initialMap = new Map();
      initialMap.set("test", "testValue");

      this.service = new MapImpl(initialMap);
    });

    describe("set()", () => {
      before(() => {
        this.service.set("test2", "test2");
      });
      after(() => {
        this.service.delete("test2");
      });
      it("should add a element", () => {
        expect(this.service.size).to.equal(2);
      });
    });

    describe("has()", () => {
      it("should return true", () => {
        expect(this.service.has("test")).to.be.true;
      });

      it("should return false", () => {
        expect(this.service.has("any")).to.be.false;
      });
    });

    describe("get()", () => {
      it("should return element", () => {
        expect(this.service.get("test")).to.eq("testValue");
      });

      it("should return undefined", () => {
        expect(this.service.get("any")).to.be.undefined;
      });
    });

    describe("forEach()", () => {
      before(() => {
        this.list = [];
        this.service.forEach((item: any) => {
          this.list.push(item);
        });
      });
      it("should return the list", () => {
        expect(this.list.length).to.eq(this.service.size);
      });
    });

    describe("keys()", () => {
      before(() => {
        this.list = Array.from(this.service.keys());
      });
      it("should return the list", () => {
        expect(this.list).to.deep.eq(["test"]);
      });
    });

    describe("entries()", () => {
      before(() => {
        this.list = Array.from(this.service.entries());
      });
      it("should return the list", () => {
        expect(this.list).to.deep.eq([["test", "testValue"]]);
      });
    });

    describe("values()", () => {
      before(() => {
        this.list = Array.from(this.service.values());
      });
      it("should return the list", () => {
        expect(this.list).to.deep.eq(["testValue"]);
      });
    });

    describe("Array.from()", () => {
      before(() => {
        this.list = Array.from(this.service);
      });

      it("should return a list", () => {
        expect(this.list).to.deep.eq([["test", "testValue"]]);
      });
    });

    describe("clear()", () => {
      before(() => {
        this.service.clear();
      });
      it("should add a element", () => {
        expect(this.service.size).to.equal(0);
      });
    });
  });
  describe("with filtering", () => {
    before(() => {
      const initialMap = new Map();
      initialMap.set("test", {type: "type1"});
      initialMap.set("test2", {type: "type2"});
      initialMap.set("test3", {type: "type1"});
      initialMap.set("test4", {type: "type4"});

      this.service = new MapFilteredImpl(initialMap);
    });

    describe("set()", () => {
      before(() => {
        this.service.set("test5", {type: "any"});
      });

      it("should add a element", () => {
        expect(this.service.has("test5")).to.be.false;
      });
    });

    describe("delete()", () => {
      it("should do nothing", () => {
        expect(this.service.delete("test")).to.be.false;
      });
    });

    describe("has()", () => {
      it("should return true", () => {
        expect(this.service.has("test")).to.be.true;
      });

      it("should return false", () => {
        expect(this.service.has("test2")).to.be.false;
      });
    });

    describe("get()", () => {
      it("should return element", () => {
        expect(this.service.get("test")).to.deep.eq({type: "type1"});
      });

      it("should return undefined", () => {
        expect(this.service.get("test2")).to.be.undefined;
      });
    });

    describe("forEach()", () => {
      before(() => {
        this.list = [];
        this.service.forEach((item: any) => {
          this.list.push(item);
        });
      });
      it("should return the list", () => {
        expect(this.list.length).to.eq(2);
      });
    });

    describe("keys()", () => {
      before(() => {
        this.list = Array.from(this.service.keys());
      });
      it("should return the list", () => {
        expect(this.list).to.deep.eq(["test", "test3"]);
      });
    });

    describe("values()", () => {
      before(() => {
        this.list = Array.from(this.service.values());
      });
      it("should return the list", () => {
        expect(this.list).to.deep.eq([{type: "type1"}, {type: "type1"}]);
      });
    });

    describe("Array.from()", () => {
      before(() => {
        this.list = Array.from(this.service);
      });

      it("should return a list", () => {
        expect(this.list).to.deep.eq([["test", {type: "type1"}], ["test3", {type: "type1"}]]);
      });
    });

    describe("clear()", () => {
      before(() => {
        this.service.clear();
      });
      it("should add a element", () => {
        expect(this.service.size).to.equal(2);
      });
    });
  });
});
