import {StoreSet} from "@tsed/core";
import {Get, In, JsonEntityStore, JsonOperation, JsonParameter, Property, Returns} from "@tsed/schema";
import {expect} from "chai";

describe("JsonMethodStore", () => {
  describe("endpoint declaration", () => {
    it("should return an endpoint metadata", () => {
      // GIVEN
      const middleware1 = () => {};
      const middleware2 = () => {};
      const middleware3 = () => {};

      class Test {
        @StoreSet("test", "value")
        @(Get("/").Use(middleware3).UseAfter(middleware1).UseBefore(middleware2))
        method(): any {}
      }

      const endpoint = JsonEntityStore.fromMethod(Test, "method");

      // THEN
      expect(endpoint.beforeMiddlewares).to.be.an("array").and.have.length(1);
      expect(endpoint.middlewares).to.be.an("array").and.have.length(1);
      expect(endpoint.beforeMiddlewares).to.be.an("array").and.have.length(1);
      expect(endpoint.token).to.equal(Test);
      expect(endpoint.store.get("test")).to.deep.equal("value");
    });
  });

  it("should create JsonEntityStore", () => {
    class Model {
      @Property()
      id: string;

      @Get("/")
      @Returns(200, Object)
      method(@In("path") param: string) {}
    }

    // CLASS
    const storeClass = JsonEntityStore.from(Model);
    expect(storeClass).to.be.instanceOf(JsonEntityStore);
    expect(storeClass.decoratorType).to.eq("class");
    expect(storeClass.propertyName).to.eq("undefined");
    expect(storeClass.propertyKey).to.eq(undefined);
    expect(storeClass.index).to.eq(undefined);
    expect(storeClass.parent).to.eq(storeClass);

    // PROPERTY
    const storeProp = JsonEntityStore.from(Model).children.get("id");
    expect(storeProp).to.be.instanceOf(JsonEntityStore);
    expect(storeProp?.decoratorType).to.eq("property");
    expect(storeProp?.propertyKey).to.eq("id");
    expect(storeProp?.propertyName).to.eq("id");
    expect(storeProp?.index).to.eq(undefined);
    expect(storeProp?.parameter).to.eq(undefined);
    expect(storeProp?.operation).to.eq(undefined);
    expect(storeProp?.nestedGenerics).to.deep.eq([]);
    expect(storeProp?.parent).to.deep.eq(storeClass);

    // METHOD
    const storeMethod = JsonEntityStore.from(Model).children.get("method");
    expect(storeMethod).to.be.instanceOf(JsonEntityStore);
    expect(storeMethod?.propertyKey).to.eq("method");
    expect(storeMethod?.propertyName).to.eq("method");
    expect(storeMethod?.decoratorType).to.eq("method");
    expect(storeMethod?.index).to.eq(undefined);
    expect(storeMethod?.parameters.length).to.deep.eq(1);

    expect([...storeMethod?.operationPaths.entries()]).to.deep.eq([
      [
        "GET/",
        {
          method: "GET",
          path: "/"
        }
      ]
    ]);
    expect(storeMethod?.getResponseOptions(200)).to.deep.eq({
      groups: undefined,
      type: Object
    });
    expect(storeMethod?.getResponseOptions(201)).to.deep.eq({
      type: Object
    });
    expect(storeMethod?.operation).to.be.instanceOf(JsonOperation);
    expect(storeMethod?.nestedGenerics).to.deep.eq([]);
    expect(storeProp?.parent).to.deep.eq(storeClass);

    // PARAMETERS
    const storeParam = JsonEntityStore.from(Model).children.get("method")?.children.get(0);

    expect(storeParam).to.be.instanceOf(JsonEntityStore);
    expect(storeParam?.propertyKey).to.eq("method");
    expect(storeParam?.propertyName).to.eq("method");
    expect(storeParam?.index).to.eq(0);
    expect(storeParam?.decoratorType).to.eq("parameter");
    expect(storeParam?.parameter).to.be.instanceOf(JsonParameter);
    expect(storeParam?.operation).to.eq(undefined);
    expect(storeParam?.nestedGenerics).to.deep.eq([]);
    expect(storeParam?.nestedGenerics).to.deep.eq([]);
    expect(storeParam?.parent).to.deep.eq(storeMethod);
  });
});
