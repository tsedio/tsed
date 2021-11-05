import {Get, Post, UseAfter, UseBefore} from "@tsed/common";
import {StoreSet} from "@tsed/core";
import {Use} from "@tsed/platform-middlewares";
import {In, JsonEntityStore, JsonOperation, JsonParameter, OperationMethods, Property} from "@tsed/schema";
import {expect} from "chai";
import {EndpointMetadata} from "./EndpointMetadata";

describe("EndpointMetadata", () => {
  describe("view", () => {
    it("should return view value", () => {
      // GIVEN
      const middleware3 = () => {};

      class Test {
        @Use(middleware3)
        method(): any {}
      }

      const endpoint = EndpointMetadata.get(Test, "method");

      // @ts-ignore
      endpoint.view = {path: "/", test: 1};

      expect(endpoint.view).to.deep.eq({path: "/", test: 1});
    });
  });

  describe("acceptMimes", () => {
    it("should return acceptMimes value", () => {
      // GIVEN
      const middleware3 = () => {};

      class Test {
        @Use(middleware3)
        method(): any {}
      }

      const endpoint = EndpointMetadata.get(Test, "method");

      // @ts-ignore
      endpoint.acceptMimes = [];

      expect(endpoint.acceptMimes).to.deep.eq([]);
    });
  });

  describe("endpoint declaration", () => {
    it("should return an endpoint metadata", () => {
      // GIVEN
      const middleware1 = () => {};
      const middleware2 = () => {};
      const middleware3 = () => {};

      class Test {
        @UseAfter(middleware1)
        @UseBefore(middleware2)
        @Use(middleware3)
        @StoreSet("test", "value")
        method(): any {}
      }

      const endpoint = EndpointMetadata.get(Test, "method");

      // THEN
      expect(endpoint.beforeMiddlewares).to.be.an("array").and.have.length(1);

      expect(endpoint.middlewares).to.be.an("array").and.have.length(1);

      expect(endpoint.beforeMiddlewares).to.be.an("array").and.have.length(1);

      expect(endpoint.token).to.equal(Test);

      expect(endpoint.store.get("test")).to.deep.equal("value");
    });
    it("should add endpoint with path", () => {
      // GIVEN
      const middleware = () => {};

      class Test {
        @Use("/", middleware)
        method(): any {}
      }

      const endpoint = EndpointMetadata.get(Test, "method");

      // THEN
      expect(endpoint.middlewares).to.be.an("array").and.have.length(1);
    });
    it("should add endpoint with path and method", () => {
      // GIVEN
      const middleware = () => {};

      class Test {
        @Use("get", "/", middleware)
        method(): any {}
      }

      const endpoint = EndpointMetadata.get(Test, "method");

      // THEN
      expect(endpoint.middlewares).to.be.an("array").and.have.length(1);

      expect([...endpoint.operationPaths.values()]).to.deep.equal([
        {
          method: OperationMethods.GET,
          path: "/"
        }
      ]);
    });
  });
  describe("get()", () => {
    it("should return the endpoint metadata", () => {
      const middleware1 = () => {};
      const middleware2 = () => {};
      const middleware3 = () => {};

      class Test {
        @UseAfter(middleware1)
        @UseBefore(middleware2)
        @Use(middleware3)
        @StoreSet("test", "Test")
        method(): any {}

        @Use(middleware3)
        @StoreSet("test", "Test")
        method3() {}
      }

      const endpoint = EndpointMetadata.get(Test, "method");
      expect(endpoint).to.be.instanceOf(EndpointMetadata);
    });
  });
});

describe("JsonEntityStore with EndpointMetadata", () => {
  it("should create JsonEntityStore", () => {
    class Model {
      @Property()
      id: string;

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
    expect(storeMethod?.parameter).to.eq(undefined);
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
