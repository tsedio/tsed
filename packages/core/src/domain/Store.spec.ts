import {Metadata} from "./Metadata";
import {CLASS_STORE, METHOD_STORE, PARAM_STORE, PROPERTY_STORE, Store} from "./Store";

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
      beforeEach(() => {
        spyGet = jest.spyOn(Metadata, "getOwn");
        store = Store.from(FakeMetadata);
        store2 = Store.from(FakeMetadata);
        store3 = Store.from(class {});

        store.set("keyTest", {test: "2"});
      });

      it("should have been called the Metadata.get()", () => {
        expect(spyGet).toHaveBeenCalledWith(CLASS_STORE, FakeMetadata);
      });

      it("should share the same StoreMap when the signature is equals", () => {
        expect(store.get("keyTest")).toBe(store2.get("keyTest"));
      });

      it("should not share the same StoreMap when the signature is not equals", () => {
        expect(store.get("keyTest")).not.toBe(store3.get("keyTest"));
      });
    });

    describe("when metadata should be store on method", () => {
      it("should have been called the Metadata.get()", () => {
        const spyGet = jest.spyOn(Metadata, "getOwn");
        Store.from(FakeMetadata, "get", {
          value: () => {}
        });

        expect(spyGet).toHaveBeenCalledWith(METHOD_STORE, FakeMetadata, "get");
      });
    });

    describe("when metadata should be store on property (1)", () => {
      it("should have been called the Metadata.get()", () => {
        const spyGet = jest.spyOn(Metadata, "getOwn");
        const store = Store.from(FakeMetadata, "get");
        expect(spyGet).toHaveBeenCalledWith(PROPERTY_STORE, FakeMetadata, "get");
      });
    });

    describe("when metadata should be store on property (2)", () => {
      it("should have been called the Metadata.get()", () => {
        const spyGet = jest.spyOn(Metadata, "getOwn");
        Store.from(FakeMetadata, "get", {
          set: () => {}
        });

        expect(spyGet).toHaveBeenCalledWith(PROPERTY_STORE, FakeMetadata, "get");
      });
    });

    describe("when metadata should be store on property (3)", () => {
      it("should have been called the Metadata.get()", () => {
        const spyGet = jest.spyOn(Metadata, "getOwn");
        Store.from(FakeMetadata, "get", {
          get: () => {}
        });

        expect(spyGet).toHaveBeenCalledWith(PROPERTY_STORE, FakeMetadata, "get");
      });
    });

    describe("when metadata should be store on parameters", () => {
      it("should have been called the Metadata.get()", () => {
        const spyGet = jest.spyOn(Metadata, "getOwn");
        Store.from(FakeMetadata, "get", 0);

        expect(spyGet).toHaveBeenCalledWith(PARAM_STORE, FakeMetadata, "get");
      });
    });
  });

  describe("set()", () => {
    it("should add a metadata", () => {
      const store = Store.from(FakeMetadata);
      store.set("key", {});

      expect(store.get("key")).toEqual({});
    });
  });

  describe("has()", () => {
    it("should return true if class is known", () => {
      const store = Store.from(FakeMetadata);
      expect(store.has("key")).toBe(true);
    });
    it("should return false if class is unknown", () => {
      const store = Store.from(FakeMetadata);
      expect(store.has("key2")).toBe(false);
    });
  });

  describe("delete()", () => {
    it("should remove key", () => {
      const store = Store.from(FakeMetadata);
      store.set("key", {test: true});

      expect(store.get("key")).toEqual({test: true});

      store.delete("key");
      expect(store.get("key")).toBeUndefined();
    });
  });

  describe("merge()", () => {
    it("should merge metadata", () => {
      const store = Store.from(FakeMetadata);
      store.merge("key3", {attr1: 1});
      store.merge("key3", {attr2: 2});

      expect(store.get("key3")).toEqual({attr1: 1, attr2: 2});
    });
  });

  describe("inheritance", () => {
    it("should haven't the same sc", () => {
      Store.from(FakeMetadata).set("sc", {test: "test"});
      Store.from(SuperFake).set("sc", {test: "test2"});
      const r1 = Store.from(SuperFake).get("sc");
      const r2 = Store.from(FakeMetadata).get("sc");

      expect(r1).not.toEqual(r2);
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

      expect(store2.get("test")).toBe("value");
      expect(store3.get("test")).toBeUndefined();
    });
  });
});
