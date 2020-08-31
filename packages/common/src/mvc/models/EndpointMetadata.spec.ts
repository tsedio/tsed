import {UseAfter, UseBefore} from "@tsed/common";
import {StoreSet} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {stub} from "../../../../../test/helper/tools";
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
      const store: any = Object.fromEntries(Array.from(endpoint.store.entries()));

      // THEN
      expect(endpoint.beforeMiddlewares).to.be.an("array").and.have.length(1);

      expect(endpoint.middlewares).to.be.an("array").and.have.length(1);

      expect(endpoint.beforeMiddlewares).to.be.an("array").and.have.length(1);

      expect(endpoint.target).to.equal(Test);

      expect(store).to.deep.equal({test: "value"});
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

      expect(endpoint.pathsMethods).to.deep.equal([
        {
          method: undefined,
          path: "/"
        }
      ]);
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

      expect(endpoint.pathsMethods).to.deep.equal([
        {
          method: "get",
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
  describe("statusResponse()", () => {
    describe("when haven't responses", () => {
      it("should haven't type, headers and collectionType", () => {
        class Test {}

        // GIVEN
        const endpointMetadata = EndpointMetadata.get(Test, "method");
        Sinon.stub(endpointMetadata.store, "get");

        stub(endpointMetadata.store.get).withArgs("responses").returns({});

        // WHEN
        const result = endpointMetadata.statusResponse(200);

        expect(result).to.deep.eq({
          code: 200
        });

        expect(endpointMetadata.type).to.eq(undefined);
        expect(endpointMetadata.collectionType).to.eq(undefined);

        stub(endpointMetadata.store.get).restore();
      });
    });

    describe("when have empty responses", () => {
      it("should haven't type, headers and collectionType", () => {
        class Test {}

        // GIVEN
        const endpointMetadata = EndpointMetadata.get(Test, "method");
        Sinon.stub(endpointMetadata.store, "get");

        stub(endpointMetadata.store.get)
          .withArgs("responses")
          .returns({
            [200]: {}
          });

        // WHEN
        const result = endpointMetadata.statusResponse(200);

        // THEN
        expect(result).to.deep.eq({
          code: 200
        });

        expect(endpointMetadata.type).to.eq(undefined);
        expect(endpointMetadata.collectionType).to.eq(undefined);

        stub(endpointMetadata.store.get).restore();
      });
    });

    describe("when have responses", () => {
      it("should have type and headers and haven't collectionType", () => {
        class Test {}

        // GIVEN
        const endpointMetadata = EndpointMetadata.get(Test, "method");
        endpointMetadata.responses.set(200, {
          type: Test,
          headers: {
            headerName: {
              type: "string",
              value: "x-content"
            }
          }
        } as any);

        // WHEN
        const result = endpointMetadata.statusResponse(200);

        // THEN
        expect(result).to.deep.eq({
          headers: {
            headerName: {
              type: "string",
              value: "x-content"
            }
          },
          type: Test
        });
        expect(endpointMetadata.type).to.eq(Test);
        expect(endpointMetadata.collectionType).to.eq(undefined);
      });
    });
  });
});
