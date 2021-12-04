import {Get, JsonEntityStore, JsonOperation, JsonOperationRoute, Name} from "@tsed/schema";
import {expect} from "chai";

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

    expect(operationRoute.operationPath).to.deep.eq({
      method: "GET",
      path: "/"
    });
    expect(operationRoute.method).to.deep.eq("GET");
    expect(operationRoute.path).to.deep.eq("/");
    expect(operationRoute.fullPath).to.deep.eq("/base/");
    expect(operationRoute.url).to.deep.eq("/base/");
    expect(operationRoute.isFinal).to.deep.eq(false);
    expect(operationRoute.name).to.deep.eq("Test.get()");
    expect(operationRoute.className).to.deep.eq("Test");
    expect(operationRoute.methodClassName).to.deep.eq("get");
    expect(operationRoute.propertyKey).to.deep.eq("get");
    expect(operationRoute.propertyName).to.deep.eq("get");
    expect(operationRoute.operation).to.be.instanceof(JsonOperation);
    expect(operationRoute.operationId).to.eq("get");
    expect(operationRoute.parameters).to.deep.eq([]);
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

    expect(operationRoute.operationPath).to.deep.eq({
      method: "GET",
      path: "/"
    });
    expect(operationRoute.method).to.deep.eq("GET");
    expect(operationRoute.path).to.deep.eq("/");
    expect(operationRoute.fullPath).to.deep.eq("/base/");
    expect(operationRoute.url).to.deep.eq("/base/");
    expect(operationRoute.isFinal).to.deep.eq(false);
    expect(operationRoute.name).to.deep.eq("Test.get()");
    expect(operationRoute.className).to.deep.eq("Test");
    expect(operationRoute.methodClassName).to.deep.eq("get");
    expect(operationRoute.propertyKey).to.deep.eq("get");
    expect(operationRoute.propertyName).to.deep.eq("get");
    expect(operationRoute.operation).to.be.instanceof(JsonOperation);
    expect(operationRoute.operationId).to.eq("get");
  });
});
