import {Get, Post, UseAfter, UseBefore} from "@tsed/common";
import {StoreSet} from "@tsed/core";
import {In, JsonEntityStore, JsonOperation, JsonParameter, OperationMethods, Property} from "@tsed/schema";
import {expect} from "chai";
import {Use} from "../decorators/method/use";
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

      endpoint.view = {path: "/", test: 1};

      expect(endpoint.view).to.deep.eq({path: "/", test: 1});
    });
  });

  describe("redirect", () => {
    it("should return redirect value", () => {
      // GIVEN
      const middleware3 = () => {};

      class Test {
        @Use(middleware3)
        method(): any {}
      }

      const endpoint = EndpointMetadata.get(Test, "method");

      endpoint.redirect = {url: "/path"};

      expect(endpoint.redirect).to.deep.eq({url: "/path", status: 302});

      endpoint.redirect = {url: "/path", status: 301};

      expect(endpoint.redirect).to.deep.eq({url: "/path", status: 301});
    });
  });

  describe("location", () => {
    it("should return location value", () => {
      // GIVEN
      const middleware3 = () => {};

      class Test {
        @Use(middleware3)
        method(): any {}
      }

      const endpoint = EndpointMetadata.get(Test, "method");

      endpoint.location = "/location";

      expect(endpoint.location).to.deep.eq("/location");
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
      expect(endpoint.beforeMiddlewares)
        .to.be.an("array")
        .and.have.length(1);

      expect(endpoint.middlewares)
        .to.be.an("array")
        .and.have.length(1);

      expect(endpoint.beforeMiddlewares)
        .to.be.an("array")
        .and.have.length(1);

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
      expect(endpoint.middlewares)
        .to.be.an("array")
        .and.have.length(1);
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
      expect(endpoint.middlewares)
        .to.be.an("array")
        .and.have.length(1);

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
  describe("clone()", () => {
    it("should return the endpoint metadata", () => {
      class Test {
        @Use("/")
        use() {}

        @Get("/")
        get(): any {}

        @Post("/")
        @Get("/")
        postAndGet() {}
      }

      const endpoint1 = EndpointMetadata.get(Test, "use");
      const cloned1 = endpoint1.clone();
      expect(cloned1.operation).to.be.instanceOf(JsonOperation);
      expect(cloned1.children).to.be.instanceOf(Map);
      expect([...(cloned1.operation?.operationPaths.values() || [])]).to.deep.eq([
        {
          method: OperationMethods.CUSTOM,
          path: "/"
        }
      ]);

      const endpoint2 = EndpointMetadata.get(Test, "get");
      const cloned2 = endpoint2.clone();
      expect(cloned2.operation).to.be.instanceOf(JsonOperation);
      expect([...(cloned2.operation?.operationPaths.values() || [])]).to.deep.eq([
        {
          method: OperationMethods.GET,
          path: "/"
        }
      ]);

      const endpoint3 = EndpointMetadata.get(Test, "postAndGet");
      const cloned3 = endpoint3.clone();
      expect(cloned3.operation).to.be.instanceOf(JsonOperation);
      expect([...(cloned3.operation?.operationPaths.values() || [])]).to.deep.eq([
        {
          method: "GET",
          path: "/"
        },
        {
          method: "POST",
          path: "/"
        }
      ]);
    });
  });
  describe("getEndpoints()", () => {
    it("should return endpoints", () => {
      // GIVEN
      const middleware1 = () => {};
      const middleware2 = () => {};
      const middleware3 = () => {};
      const middleware4 = () => {};

      class Test2 {
        @Use(middleware4)
        @StoreSet("test", "Test2")
        method1(): any {}
      }

      class Test1 extends Test2 {
        @Use(middleware4)
        @StoreSet("test", "Test1")
        method(): any {}

        @Use(middleware4)
        @StoreSet("test", "Test1")
        method2(): any {}
      }

      class Test extends Test1 {
        @UseAfter(middleware1)
        @UseBefore(middleware2)
        @Use(middleware3)
        @StoreSet("test", "Test")
        method(): any {}

        @Use(middleware3)
        @StoreSet("test", "Test")
        method3() {}
      }

      const endpoints = EndpointMetadata.getEndpoints(Test);

      expect(endpoints[0].propertyKey).to.equal("method");
      expect(endpoints[1].propertyKey).to.equal("method3");
      expect(endpoints[2].propertyKey).to.equal("method2");
      expect(endpoints[3].propertyKey).to.equal("method1");

      expect(endpoints[0].store.get("test")).to.equal("Test");
      expect(endpoints[1].store.get("test")).to.equal("Test");
      expect(endpoints[2].store.get("test")).to.equal("Test1");
      expect(endpoints[3].store.get("test")).to.equal("Test2");
    });
  });
  // describe("statusResponse()", () => {
  //   describe("when haven't responses", () => {
  //     it("should haven't type, headers and collectionType", () => {
  //       class Test {
  //         method() {
  //         }
  //       }
  //
  //       // GIVEN
  //       const endpoint = EndpointMetadata.get(Test, "method");
  //       Sinon.stub(endpoint.store, "get");
  //
  //       stub(endpoint.store.get)
  //         .withArgs("responses")
  //         .returns({});
  //
  //       // WHEN
  //       const result = endpoint.statusResponse(200);
  //
  //       expect(result).to.deep.eq({
  //         code: 200
  //       });
  //
  //       expect(endpoint.type).to.eq(undefined);
  //       expect(endpoint.collectionType).to.eq(undefined);
  //
  //       stub(endpoint.store.get).restore();
  //     });
  //   });
  //
  //   describe("when have empty responses", () => {
  //     it("should haven't type, headers and collectionType", () => {
  //       class Test {
  //         method() {
  //         }
  //       }
  //
  //       // GIVEN
  //       const endpointMetadata = EndpointMetadata.get(Test, "method");
  //       Sinon.stub(endpointMetadata.store, "get");
  //
  //       stub(endpointMetadata.store.get)
  //         .withArgs("responses")
  //         .returns({
  //           [200]: {}
  //         });
  //
  //       // WHEN
  //       const result = endpointMetadata.statusResponse(200);
  //
  //       // THEN
  //       expect(result).to.deep.eq({
  //         code: 200
  //       });
  //
  //       expect(endpointMetadata.type).to.eq(undefined);
  //       expect(endpointMetadata.collectionType).to.eq(undefined);
  //
  //       stub(endpointMetadata.store.get).restore();
  //     });
  //   });
  //
  //   describe("when have responses", () => {
  //     it("should have type and headers and haven't collectionType", () => {
  //       class Test {
  //         method() {
  //         }
  //       }
  //
  //       // GIVEN
  //       const endpointMetadata = EndpointMetadata.get(Test, "method");
  //       endpointMetadata.responses.set(200, {
  //         type: Test,
  //         headers: {
  //           headerName: {
  //             type: "string",
  //             value: "x-content"
  //           }
  //         }
  //       } as any);
  //
  //       // WHEN
  //       const result = endpointMetadata.statusResponse(200);
  //
  //       // THEN
  //       expect(result).to.deep.eq({
  //         headers: {
  //           headerName: {
  //             type: "string",
  //             value: "x-content"
  //           }
  //         },
  //         type: Test
  //       });
  //       expect(endpointMetadata.type).to.eq(Test);
  //       expect(endpointMetadata.collectionType).to.eq(undefined);
  //     });
  //   });
  // });
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
    const storeParam = JsonEntityStore.from(Model)
      .children.get("method")
      ?.children.get(0);

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
