import {StoreSet} from "@tsed/core";
import {All, Children, Get, getOperationsRoutes, In, Path} from "@tsed/schema";
import {JsonOperationRoute} from "../domain/JsonOperationRoute";

function getData(operationRoute: JsonOperationRoute) {
  return {
    token: operationRoute.token,
    target: operationRoute.endpoint.token,
    propertyKey: operationRoute.propertyKey,
    path: operationRoute.path,
    fullPath: operationRoute.fullPath,
    method: operationRoute.method,
    storeValue: operationRoute.store.get("test"),
    isFinal: operationRoute.isFinal
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
        token: Test,
        isFinal: false
      },
      {
        fullPath: "/test",
        method: "GET",
        path: "/",
        propertyKey: "method3",
        storeValue: "Test",
        target: Test,
        token: Test,
        isFinal: false
      },
      {
        fullPath: "/test/all",
        method: "ALL",
        path: "/all",
        propertyKey: "all",
        storeValue: undefined,
        target: Test,
        token: Test,
        isFinal: true
      },
      {
        fullPath: "/test",
        method: "GET",
        path: "/",
        propertyKey: "method2",
        storeValue: "Test1",
        target: Test1,
        token: Test,
        isFinal: false
      },
      {
        fullPath: "/test",
        method: "GET",
        path: "/",
        propertyKey: "method1",
        storeValue: "Test2",
        target: Test2,
        token: Test,
        isFinal: true
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
        isFinal: true,
        method: "GET",
        path: "/",
        propertyKey: "method",
        storeValue: "deep",
        target: TestChild2,
        token: TestChild2
      },
      {
        fullPath: "/test/children",
        isFinal: true,
        method: "GET",
        path: "/",
        propertyKey: "method",
        storeValue: "children",
        target: TestChild,
        token: TestChild
      },
      {
        fullPath: "/test",
        isFinal: false,
        method: "GET",
        path: "/",
        propertyKey: "method",
        storeValue: "Test",
        target: Test,
        token: Test
      },
      {
        fullPath: "/test",
        isFinal: true,
        method: "GET",
        path: "/",
        propertyKey: "method3",
        storeValue: "Test",
        target: Test,
        token: Test
      },
      {
        fullPath: "/test/all",
        isFinal: true,
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
        isFinal: true,
        method: "GET",
        path: "/",
        propertyKey: "method",
        storeValue: "deep",
        target: TestChild2,
        token: TestChild2
      },
      {
        fullPath: "/rest/test/children",
        isFinal: true,
        method: "GET",
        path: "/",
        propertyKey: "method",
        storeValue: "children",
        target: TestChild,
        token: TestChild
      },
      {
        fullPath: "/rest/test",
        isFinal: false,
        method: "GET",
        path: "/",
        propertyKey: "method",
        storeValue: "Test",
        target: Test,
        token: Test
      },
      {
        fullPath: "/rest/test",
        isFinal: true,
        method: "GET",
        path: "/",
        propertyKey: "method3",
        storeValue: "Test",
        target: Test,
        token: Test
      },
      {
        fullPath: "/rest/test/all",
        isFinal: true,
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
