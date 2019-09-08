import {expect} from "chai";
import * as Sinon from "sinon";
import {CLASS_STORE, Metadata, METHOD_STORE, PARAM_STORE, PROPERTY_STORE, Store} from "../../src";

class FakeMetadata {
  attr1: any;
  attr2: any;

  constructor(public target: any) {
  }

  test() {
    return this.target;
  }
}

class SuperFake extends FakeMetadata {
}

describe("Store", () => {
  describe("constructor", () => {
    describe("when metadata should be store on class", () => {
      let spyGet: any, store: any, store2: any, store3: any;
      before(() => {
        spyGet = Sinon.spy(Metadata, "getOwn");
        store = new Store([FakeMetadata]);
        store2 = new Store([FakeMetadata]);
        store3 = new Store([class {
        }]);

        store.set("keyTest", {test: "2"});
      });
      after(() => {
        spyGet.restore();
        store.clear();
      });

      it("should have been called the Metadata.get()", () => {
        spyGet.should.have.been.calledWithExactly(CLASS_STORE, FakeMetadata);
      });

      it("should share the same StoreMap when the signature is equals", () => {
        expect(store.get("keyTest")).to.eq(store2.get("keyTest"));
      });

      it("should not share the same StoreMap when the signature is not equals", () => {
        expect(store.get("keyTest")).not.to.eq(store3.get("keyTest"));
      });
    });

    describe("when metadata should be store on method", () => {
      let spyGet: any, store: any;
      before(() => {
        spyGet = Sinon.spy(Metadata, "getOwn");
        store = new Store([
          FakeMetadata,
          "get",
          {
            value: () => {
            }
          }
        ]);
      });
      after(() => {
        spyGet.restore();
      });

      it("should have been called the Metadata.get()", () => {
        spyGet.should.have.been.calledWithExactly(METHOD_STORE, FakeMetadata, "get");
      });
    });

    describe("when metadata should be store on property (1)", () => {
      let spyGet: any, store: any;
      before(() => {
        spyGet = Sinon.spy(Metadata, "getOwn");
        store = new Store([FakeMetadata, "get"]);
      });
      after(() => {
        spyGet.restore();
      });

      it("should have been called the Metadata.get()", () => {
        spyGet.should.have.been.calledWithExactly(PROPERTY_STORE, FakeMetadata, "get");
      });
    });

    describe("when metadata should be store on property (2)", () => {
      let spyGet: any, store: any;
      before(() => {
        spyGet = Sinon.spy(Metadata, "getOwn");
        store = new Store([
          FakeMetadata,
          "get",
          {
            set: () => {
            }
          }
        ]);
      });
      after(() => {
        spyGet.restore();
      });

      it("should have been called the Metadata.get()", () => {
        spyGet.should.have.been.calledWithExactly(PROPERTY_STORE, FakeMetadata, "get");
      });
    });

    describe("when metadata should be store on property (3)", () => {
      let spyGet: any, store: any;
      before(() => {
        spyGet = Sinon.spy(Metadata, "getOwn");
        store = new Store([
          FakeMetadata,
          "get",
          {
            get: () => {
            }
          }
        ]);
      });
      after(() => {
        spyGet.restore();
      });

      it("should have been called the Metadata.get()", () => {
        spyGet.should.have.been.calledWithExactly(PROPERTY_STORE, FakeMetadata, "get");
      });
    });

    describe("when metadata should be store on parameters", () => {
      let spyGet: any, store: any;
      before(() => {
        spyGet = Sinon.spy(Metadata, "getOwn");
        store = new Store([FakeMetadata, "get", 0]);
      });
      after(() => {
        spyGet.restore();
      });

      it("should have been called the Metadata.get()", () => {
        spyGet.should.have.been.calledWithExactly(PARAM_STORE, FakeMetadata, "get");
      });
    });
  });

  describe("set()", () => {
    let store: any;
    before(() => {
      store = new Store([FakeMetadata]);
      store.set("key", {});
    });
    it("should add a metadata", () => {
      expect(store.size).to.equal(1);
    });
  });

  describe("has()", () => {
    let store: any;
    before(() => {
      store = new Store([FakeMetadata]);
    });
    it("should add a metadata", () => {
      store.set("key", {});
      expect(store.size).to.equal(1);
    });
    it("should return true if class is known", () => {
      expect(store.has("key")).to.be.true;
    });
    it("should return false if class is unknown", () => {
      expect(store.has("key2")).to.be.false;
    });
  });

  describe("get()", () => {
    let store: any;
    before(() => {
      store = new Store([FakeMetadata]);
    });
    it("should add a metadata", () => {
      store.set("key", {test: true});
      expect(store.size).to.equal(1);
    });
    it("should get metadata", () => {
      expect(store.get("key").test).to.be.true;
    });
  });

  describe("entries()", () => {
    let store: any;
    before(() => {
      store = new Store([FakeMetadata]);
    });
    it("should add a metadata", () => {
      store.set("key", {test: true});
      expect(store.size).to.equal(1);
    });

    it("should return entries", () => {
      expect(typeof store.entries()).to.equal("object");
    });
  });

  describe("keys()", () => {
    let store: any;
    before(() => {
      store = new Store([FakeMetadata]);
      store.set("test", {test: true});
    });

    it("should return the keys", () => {
      expect(typeof store.keys()).to.equal("object");
    });
  });

  describe("clear()", () => {
    let store: any;
    before(() => {
      store = new Store([FakeMetadata]);
      store.set("key", {test: true});
      store.clear();
    });

    it("should remove all keys", () => {
      expect(store.size).to.equal(0);
    });
  });

  describe("delete()", () => {
    let store: any;
    before(() => {
      store = new Store([FakeMetadata]);
    });
    it("should add a metadata", () => {
      store.set("key", {test: true});
      expect(store.size).to.equal(1);
    });

    it("should remove all keys", () => {
      store.delete("key");
      expect(store.size).to.equal(0);
    });
  });

  describe("forEach()", () => {
    let store: any;
    before(() => {
      store = new Store([FakeMetadata]);
    });
    it("should add a metadata", () => {
      store.set("key", {test: true});
      expect(store.size).to.equal(1);
    });

    it("should loop for each item stored in registry", () => {
      const o: any = [];
      store.forEach((e: any) => o.push(e));
      expect(o.length).to.equal(1);
    });
  });

  describe("values()", () => {
    let store: any;
    before(() => {
      store = new Store([FakeMetadata]);
    });
    it("should add a metadata", () => {
      store.set("key", {test: true});
      expect(store.size).to.equal(1);
    });

    it("should return the values", () => {
      expect(typeof store.values()).to.equal("object");
    });
  });

  describe("merge()", () => {
    let store: any;
    before(() => {
      store = new Store([FakeMetadata]);
      store.merge("key3", {attr1: 1});
      store.merge("key3", {attr2: 2});
    });

    it("should merge metadata", () => {
      expect(store.get("key3")).to.deep.equal({attr1: 1, attr2: 2});
    });
  });

  describe("storeValues()", () => {
    let store: any;
    before(() => {
      store = new Store([FakeMetadata]);
      store.storeValues({content: "json", content2: "json2"});
    });

    it("should store data", () => {
      expect(store.get("content")).to.eq("json");
    });
    it("should store data", () => {
      expect(store.get("content2")).to.eq("json2");
    });
  });

  describe("inheritance", () => {
    let r1: any, r2: any;
    before(() => {
      Store.from(FakeMetadata).set("sc", {test: "test"});
      Store.from(SuperFake).set("sc", {test: "test2"});
      r1 = Store.from(SuperFake).get("sc");
      r2 = Store.from(FakeMetadata).get("sc");
    });

    it("should haven't the same sc", () => {
      expect(r1).to.not.deep.equal(r2);
    });
  });

  describe("from()", () => {
    describe("from Symbol", () => {
      it("should create a store from Symbol", () => {
        // GIVEN
        const TOKEN = Symbol.for("token");
        const TOKEN2 = Symbol.for("token2");
        const store1 = Store.from(TOKEN);
        const store2 = Store.from(TOKEN);
        const store3 = Store.from(TOKEN2);

        // WHEN
        store1.set("test", "value");

        expect(store2.get("test")).to.eq("value");
        expect(store3.get("test")).to.eq(undefined);
      });
    });
  });
});
