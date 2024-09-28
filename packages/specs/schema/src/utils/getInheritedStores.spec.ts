import {StoreSet} from "@tsed/core";

import {OperationPath} from "../decorators/operations/operationPath.js";
import {getInheritedStores} from "./getInheritedStores.js";

describe("getInheritedStores", () => {
  it("should return inherited store", () => {
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

    const stores = [...getInheritedStores(Test).entries()];

    expect(stores[0][0]).toEqual(Test);
    expect(stores[1][0]).toEqual(Test1);
    expect(stores[2][0]).toEqual(Test2);

    const entity1 = stores[0][1].children.get("method");
    const entity2 = stores[1][1].children.get("method");
    const entity3 = stores[2][1].children.get("method");
    expect(entity1?.store.get("test")).toEqual("Test");
    expect(entity2?.store.get("test")).toEqual("Test1");
    expect(entity3?.store.get("test")).toEqual(undefined);
  });
});
