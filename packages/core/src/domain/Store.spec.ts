import {expect} from "chai";
import Sinon from "sinon";
import {CLASS_STORE, descriptorOf, Metadata, METHOD_STORE, PARAM_STORE, PROPERTY_STORE, prototypeOf, Store} from "../../src";

class FakeMetadata {
  attr1: any;
  attr2: any;

  constructor(public target: any) {}

  test() {
    return this.target;
  }
}

class SuperFake extends FakeMetadata {}

describe("Store", () => {
  describe("constructor", () => {
    describe("when metadata should be store on class", () => {
      let spyGet: any, store: any, store2: any, store3: any;
      before(() => {
        spyGet = Sinon.spy(Metadata, "getOwn");
        store = Store.from(FakeMetadata);
        store2 = Store.from(FakeMetadata);
        store3 = Store.from(class {});

        store.set("keyTest", {test: "2"});
      });
      after(() => {
        spyGet.restore();
      });

      it("should have been called the Metadata.get()", () => {
        expect(spyGet).to.have.been.calledWithExactly(CLASS_STORE, FakeMetadata);
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
        store = Store.from(FakeMetadata, "get", {
          value: () => {}
        });
      });
      after(() => {
        spyGet.restore();
      });

      it("should have been called the Metadata.get()", () => {
        expect(spyGet).to.have.been.calledWithExactly(METHOD_STORE, FakeMetadata, "get");
      });
    });

    describe("when metadata should be store on property (1)", () => {
      let spyGet: any, store: any;
      before(() => {
        spyGet = Sinon.spy(Metadata, "getOwn");
        store = Store.from(FakeMetadata, "get");
      });
      after(() => {
        spyGet.restore();
      });

      it("should have been called the Metadata.get()", () => {
        expect(spyGet).to.have.been.calledWithExactly(PROPERTY_STORE, FakeMetadata, "get");
      });
    });

    describe("when metadata should be store on property (2)", () => {
      let spyGet: any, store: any;
      before(() => {
        spyGet = Sinon.spy(Metadata, "getOwn");
        store = Store.from(FakeMetadata, "get", {
          set: () => {}
        });
      });
      after(() => {
        spyGet.restore();
      });

      it("should have been called the Metadata.get()", () => {
        expect(spyGet).to.have.been.calledWithExactly(PROPERTY_STORE, FakeMetadata, "get");
      });
    });

    describe("when metadata should be store on property (3)", () => {
      let spyGet: any, store: any;
      before(() => {
        spyGet = Sinon.spy(Metadata, "getOwn");
        store = Store.from(FakeMetadata, "get", {
          get: () => {}
        });
      });
      after(() => {
        spyGet.restore();
      });

      it("should have been called the Metadata.get()", () => {
        expect(spyGet).to.have.been.calledWithExactly(PROPERTY_STORE, FakeMetadata, "get");
      });
    });

    describe("when metadata should be store on parameters", () => {
      let spyGet: any, store: any;
      before(() => {
        spyGet = Sinon.spy(Metadata, "getOwn");
        store = Store.from(FakeMetadata, "get", 0);
      });
      after(() => {
        spyGet.restore();
      });

      it("should have been called the Metadata.get()", () => {
        expect(spyGet).to.have.been.calledWithExactly(PARAM_STORE, FakeMetadata, "get");
      });
    });
  });

  describe("set()", () => {
    let store: any;
    before(() => {
      store = Store.from(FakeMetadata);
      store.set("key", {});
    });
    it("should add a metadata", () => {
      expect(store.get("key")).to.deep.equal({});
    });
  });

  describe("has()", () => {
    let store: any;
    before(() => {
      store = Store.from(FakeMetadata);
    });
    it("should return true if class is known", () => {
      expect(store.has("key")).to.be.true;
    });
    it("should return false if class is unknown", () => {
      expect(store.has("key2")).to.be.false;
    });
  });

  describe("delete()", () => {
    let store: any;
    before(() => {
      store = Store.from(FakeMetadata);
    });
    it("should remove key", () => {
      store.set("key", {test: true});
      expect(store.get("key")).to.deep.equal({test: true});
      store.delete("key");
      expect(store.get("key")).to.equal(undefined);
    });
  });

  describe("merge()", () => {
    let store: any;
    before(() => {
      store = Store.from(FakeMetadata);
      store.merge("key3", {attr1: 1});
      store.merge("key3", {attr2: 2});
    });

    it("should merge metadata", () => {
      expect(store.get("key3")).to.deep.equal({attr1: 1, attr2: 2});
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
