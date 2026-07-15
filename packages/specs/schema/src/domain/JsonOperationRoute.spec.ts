import {BodyParams} from "@tsed/platform-params";

import {Get, getJsonMethodStore, JsonMethodPath, JsonOperation, JsonOperationRoute, Name, OperationVerbs} from "../index.js";

describe("JsonOperationRoute", () => {
  it("should create JsonOperationRoute instance", () => {
    class Test {
      @Get("/")
      get() {}
    }

    const endpoint = getJsonMethodStore(Test, "get");
    const operationRoute = new JsonOperationRoute({
      token: Test,
      endpoint,
      operationPath: new JsonMethodPath("GET", "/"),
      basePath: "/base"
    });

    expect(operationRoute.operationPath?.method).toEqual("GET");
    expect(operationRoute.operationPath?.path).toEqual("/");
    expect(operationRoute.method).toEqual("GET");
    expect(operationRoute.path).toEqual("/");
    expect(operationRoute.fullPath).toEqual("/base");
    expect(operationRoute.url).toEqual("/base");
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

    const endpoint = getJsonMethodStore(Test, "get");
    const operationRoute = new JsonOperationRoute({
      token: Test,
      endpoint,
      operationPath: new JsonMethodPath(OperationVerbs.GET, "/"),
      basePath: "/base"
    });

    expect(operationRoute.operationPath?.method).toEqual("GET");
    expect(operationRoute.operationPath?.path).toEqual("/");
    expect(operationRoute.method).toEqual("GET");
    expect(operationRoute.path).toEqual("/");
    expect(operationRoute.fullPath).toEqual("/base");
    expect(operationRoute.url).toEqual("/base");
    expect(operationRoute.name).toEqual("Test.get()");
    expect(operationRoute.className).toEqual("Test");
    expect(operationRoute.methodClassName).toEqual("get");
    expect(operationRoute.propertyKey).toEqual("get");
    expect(operationRoute.propertyName).toEqual("get");
    expect(operationRoute.operation).toBeInstanceOf(JsonOperation);
    expect(operationRoute.operationId).toBe("get");
  });
  it("should create operation with parameter", () => {
    @Name("Testify")
    class Test {
      @Get("/")
      @Name("getify")
      get(@BodyParams() body: string) {}
    }

    const endpoint = getJsonMethodStore(Test, "get");
    const operationRoute = new JsonOperationRoute({
      token: Test,
      endpoint,
      operationPath: new JsonMethodPath("GET", "/"),
      basePath: "/base"
    });

    expect(operationRoute.operationPath?.method).toEqual("GET");
    expect(operationRoute.operationPath?.path).toEqual("/");
    expect(operationRoute.method).toEqual("GET");
    expect(operationRoute.path).toEqual("/");
    expect(operationRoute.fullPath).toEqual("/base");
    expect(operationRoute.url).toEqual("/base");
    expect(operationRoute.name).toEqual("Test.get()");
    expect(operationRoute.className).toEqual("Test");
    expect(operationRoute.methodClassName).toEqual("get");
    expect(operationRoute.propertyKey).toEqual("get");
    expect(operationRoute.propertyName).toEqual("get");
    expect(operationRoute.operation).toBeInstanceOf(JsonOperation);
    expect(operationRoute.operationId).toBe("get");
    expect(operationRoute.paramsTypes).toEqual({
      BODY: true
    });
    expect(operationRoute.has("BODY")).toEqual(true);
  });
});
