import {StoreSet} from "@tsed/core";

import {getOperationsStores, OperationPath} from "../index.js";

describe("getOperationsStore", () => {
  it("should return operation with right order", () => {
    class Test2 {
      @StoreSet("test", "Test2")
      @OperationPath("GET")
      method1(): any {}
    }

    class Test1 extends Test2 {
      @StoreSet("test", "Test1")
      @OperationPath("GET")
      method(): any {}

      @StoreSet("test", "Test1")
      @OperationPath("GET")
      method2(): any {}
    }

    class Test extends Test1 {
      @StoreSet("test", "Test")
      @OperationPath("GET")
      method(): any {}

      @StoreSet("test", "Test")
      @OperationPath("GET")
      method3() {}
    }

    const stores = [...getOperationsStores(Test).entries()];

    expect(stores[0][0]).toBe("method");
    expect(stores[0][1].store.get("test")).toBe("Test");

    expect(stores[1][0]).toBe("method3");
    expect(stores[1][1].store.get("test")).toBe("Test");

    expect(stores[2][0]).toBe("method2");
    expect(stores[2][1].store.get("test")).toBe("Test1");

    expect(stores[3][0]).toBe("method1");
    expect(stores[3][1].store.get("test")).toBe("Test2");
  });
});
