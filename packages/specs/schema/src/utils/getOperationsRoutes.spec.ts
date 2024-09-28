import {StoreSet} from "@tsed/core";

import {Children} from "../decorators/class/children.js";
import {In} from "../decorators/operations/in.js";
import {Path} from "../decorators/operations/path.js";
import {All, Get} from "../decorators/operations/route.js";
import {JsonOperationRoute} from "../domain/JsonOperationRoute.js";
import {getOperationsRoutes} from "./getOperationsRoutes.js";

function getData(operationRoute: JsonOperationRoute) {
  return {
    token: operationRoute.token,
    target: operationRoute.endpoint.token,
    propertyKey: operationRoute.propertyKey,
    path: operationRoute.path,
    fullPath: operationRoute.fullPath,
    method: operationRoute.method,
    storeValue: operationRoute.store.get("test")
  };
}

describe("getOperationsRoutes()", () => {
  it("should return operation with his path and methods", () => {
    // GIVEN
    @Path("/test")
    class Test2 {
      @Get("/")
      @StoreSet("test", "Test2")
      method1(): any {}
    }

    @Path("/test")
    class Test1 extends Test2 {
      @Get("/")
      @StoreSet("test", "Test1")
      method(): any {}

      @Get("/")
      @StoreSet("test", "Test1")
      method2(): any {}
    }

    @Path("/test")
    class Test extends Test1 {
      @Get("/")
      @StoreSet("test", "Test")
      method(): any {}

      @Get("/")
      @StoreSet("test", "Test")
      method3() {}

      @All("/all")
      all() {}

      @StoreSet("test", "test-ignore")
      shouldBeIgnored(@In("any") ctx: any) {}
    }

    const operationsRoutes = getOperationsRoutes(Test);

    expect(operationsRoutes.map(getData)).toEqual([
      {
        fullPath: "/test",
        method: "GET",
        path: "/",
        propertyKey: "method",
        storeValue: "Test",
        target: Test,
        token: Test
      },
      {
        fullPath: "/test",
        method: "GET",
        path: "/",
        propertyKey: "method3",
        storeValue: "Test",
        target: Test,
        token: Test
      },
      {
        fullPath: "/test/all",
        method: "ALL",
        path: "/all",
        propertyKey: "all",
        storeValue: undefined,
        target: Test,
        token: Test
      },
      {
        fullPath: "/test",
        method: "GET",
        path: "/",
        propertyKey: "method2",
        storeValue: "Test1",
        target: Test1,
        token: Test
      },
      {
        fullPath: "/test",
        method: "GET",
        path: "/",
        propertyKey: "method1",
        storeValue: "Test2",
        target: Test2,
        token: Test
      }
    ]);
  });
  it("should ignore method not decorated with the right decorator", () => {
    // GIVEN
    @Path("/test")
    class Test {
      @StoreSet("test", "test-ignore")
      shouldBeIgnored(@In("any") ctx: any) {}
    }

    const operationsRoutes = getOperationsRoutes(Test);

    expect(operationsRoutes.map(getData)).toEqual([]);
  });
  it("should return operations routes with children", () => {
    @Path("/deep")
    class TestChild2 {
      @Get("/")
      @StoreSet("test", "deep")
      method(): any {}
    }

    @Path("/children")
    @Children(TestChild2)
    class TestChild {
      @Get("/")
      @StoreSet("test", "children")
      method(): any {}
    }

    @Path("/test")
    @Children(TestChild)
    class Test {
      @Get("/")
      @StoreSet("test", "Test")
      method(): any {}

      @Get("/")
      @StoreSet("test", "Test")
      method3() {}

      @All("/all")
      all() {}
    }

    const operationsRoutes = getOperationsRoutes(Test, {withChildren: true});

    expect(operationsRoutes.map(getData)).toEqual([
      {
        fullPath: "/test/children/deep",
        method: "GET",
        path: "/",
        propertyKey: "method",
        storeValue: "deep",
        target: TestChild2,
        token: TestChild2
      },
      {
        fullPath: "/test/children",
        method: "GET",
        path: "/",
        propertyKey: "method",
        storeValue: "children",
        target: TestChild,
        token: TestChild
      },
      {
        fullPath: "/test",
        method: "GET",
        path: "/",
        propertyKey: "method",
        storeValue: "Test",
        target: Test,
        token: Test
      },
      {
        fullPath: "/test",
        method: "GET",
        path: "/",
        propertyKey: "method3",
        storeValue: "Test",
        target: Test,
        token: Test
      },
      {
        fullPath: "/test/all",
        method: "ALL",
        path: "/all",
        propertyKey: "all",
        storeValue: undefined,
        target: Test,
        token: Test
      }
    ]);
  });
  it("should return operations routes with children and basePath", () => {
    @Path("/deep")
    class TestChild2 {
      @Get("/")
      @StoreSet("test", "deep")
      method(): any {}
    }

    @Path("/children")
    @Children(TestChild2)
    class TestChild {
      @Get("/")
      @StoreSet("test", "children")
      method(): any {}
    }

    @Path("/test")
    @Children(TestChild)
    class Test {
      @Get("/")
      @StoreSet("test", "Test")
      method(): any {}

      @Get("/")
      @StoreSet("test", "Test")
      method3() {}

      @All("/all")
      all() {}
    }

    const operationsRoutes = getOperationsRoutes(Test, {withChildren: true, basePath: "/rest"});

    expect(operationsRoutes.map(getData)).toEqual([
      {
        fullPath: "/rest/test/children/deep",
        method: "GET",
        path: "/",
        propertyKey: "method",
        storeValue: "deep",
        target: TestChild2,
        token: TestChild2
      },
      {
        fullPath: "/rest/test/children",
        method: "GET",
        path: "/",
        propertyKey: "method",
        storeValue: "children",
        target: TestChild,
        token: TestChild
      },
      {
        fullPath: "/rest/test",
        method: "GET",
        path: "/",
        propertyKey: "method",
        storeValue: "Test",
        target: Test,
        token: Test
      },
      {
        fullPath: "/rest/test",
        method: "GET",
        path: "/",
        propertyKey: "method3",
        storeValue: "Test",
        target: Test,
        token: Test
      },
      {
        fullPath: "/rest/test/all",
        method: "ALL",
        path: "/all",
        propertyKey: "all",
        storeValue: undefined,
        target: Test,
        token: Test
      }
    ]);
  });
});
