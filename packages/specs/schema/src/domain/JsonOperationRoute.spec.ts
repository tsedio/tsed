import {Get, JsonEntityStore, JsonOperation, JsonOperationRoute, Name} from "@tsed/schema";

describe("JsonOperationRoute", () => {
  it("should create JsonOperationRoute instance", () => {
    class Test {
      @Get("/")
      get() {}
    }

    const endpoint = JsonEntityStore.fromMethod(Test, "get");
    const operationRoute = new JsonOperationRoute({
      token: Test,
      endpoint,
      operationPath: {method: "GET", path: "/"},
      basePath: "/base"
    });

    expect(operationRoute.operationPath).toEqual({
      method: "GET",
      path: "/"
    });
    expect(operationRoute.method).toEqual("GET");
    expect(operationRoute.path).toEqual("/");
    expect(operationRoute.fullPath).toEqual("/base/");
    expect(operationRoute.url).toEqual("/base/");
    expect(operationRoute.isFinal).toEqual(false);
    expect(operationRoute.name).toEqual("Test.get()");
    expect(operationRoute.className).toEqual("Test");
    expect(operationRoute.methodClassName).toEqual("get");
    expect(operationRoute.propertyKey).toEqual("get");
    expect(operationRoute.propertyName).toEqual("get");
    expect(operationRoute.operation).toBeInstanceOf(JsonOperation);
    expect(operationRoute.operationId).toBe("get");
    expect(operationRoute.parameters).toEqual([]);
  });
  it("should create JsonOperationRoute instance (with alias naming)", () => {
    @Name("Testify")
    class Test {
      @Get("/")
      @Name("getify")
      get() {}
    }

    const endpoint = JsonEntityStore.fromMethod(Test, "get");
    const operationRoute = new JsonOperationRoute({
      token: Test,
      endpoint,
      operationPath: {method: "GET", path: "/"},
      basePath: "/base"
    });

    expect(operationRoute.operationPath).toEqual({
      method: "GET",
      path: "/"
    });
    expect(operationRoute.method).toEqual("GET");
    expect(operationRoute.path).toEqual("/");
    expect(operationRoute.fullPath).toEqual("/base/");
    expect(operationRoute.url).toEqual("/base/");
    expect(operationRoute.isFinal).toEqual(false);
    expect(operationRoute.name).toEqual("Test.get()");
    expect(operationRoute.className).toEqual("Test");
    expect(operationRoute.methodClassName).toEqual("get");
    expect(operationRoute.propertyKey).toEqual("get");
    expect(operationRoute.propertyName).toEqual("get");
    expect(operationRoute.operation).toBeInstanceOf(JsonOperation);
    expect(operationRoute.operationId).toBe("get");
  });
});
