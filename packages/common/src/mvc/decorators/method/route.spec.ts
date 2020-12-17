import {All, Delete, EndpointMetadata, Get, Head, Options, Patch, Post, Put} from "@tsed/common";
import {OperationMethods} from "@tsed/schema";
import {expect} from "chai";
import Sinon from "sinon";

const middleware: any = Sinon.stub();
const useStub: any = Sinon.stub().returns(middleware);

describe("Route decorators", () => {
  afterEach(() => {
    useStub.resetHistory();
  });
  describe("All", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      class Test {
        @All("/")
        test() {}
      }

      const endpoint = EndpointMetadata.get(Test, "test");

      // THEN
      expect([...endpoint.operationPaths.values()]).to.deep.eq([
        {
          method: OperationMethods.ALL,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).to.equal("test");
    });
  });

  describe("Get", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      class Test {
        @Get("/")
        test() {}
      }

      const endpoint = EndpointMetadata.get(Test, "test");

      // THEN
      expect([...endpoint.operationPaths.values()]).to.deep.eq([
        {
          method: OperationMethods.GET,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).to.equal("test");
    });
    it("should register route and middleware (2)", () => {
      const middleware = () => {};

      // WHEN
      class Test {
        @Get("/", middleware)
        test() {}
      }

      const endpoint = EndpointMetadata.get(Test, "test");

      // THEN
      expect([...endpoint.operationPaths.values()]).to.deep.eq([
        {
          method: OperationMethods.GET,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).to.equal("test");
      expect(endpoint.middlewares).to.deep.equal([middleware]);
    });
  });

  describe("Post", () => {
    it("should register route and middleware", () => {
      // WHEN
      class Test {
        @Post("/")
        test() {}
      }

      const endpoint = EndpointMetadata.get(Test, "test");

      // THEN
      expect([...endpoint.operationPaths.values()]).to.deep.eq([
        {
          method: OperationMethods.POST,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).to.equal("test");
    });
  });

  describe("Put", () => {
    it("should register route and middleware", () => {
      // WHEN
      class Test {
        @Put("/")
        test() {}
      }

      const endpoint = EndpointMetadata.get(Test, "test");

      // THEN
      expect([...endpoint.operationPaths.values()]).to.deep.eq([
        {
          method: OperationMethods.PUT,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).to.equal("test");
    });
  });

  describe("Delete", () => {
    it("should register route and middleware", () => {
      // WHEN
      class Test {
        @Delete("/")
        test() {}
      }

      const endpoint = EndpointMetadata.get(Test, "test");

      // THEN
      expect([...endpoint.operationPaths.values()]).to.deep.eq([
        {
          method: OperationMethods.DELETE,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).to.equal("test");
    });
  });

  describe("Head", () => {
    it("should register route and middleware", () => {
      // WHEN
      class Test {
        @Head("/")
        test() {}
      }

      const endpoint = EndpointMetadata.get(Test, "test");

      // THEN
      expect([...endpoint.operationPaths.values()]).to.deep.eq([
        {
          method: OperationMethods.HEAD,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).to.equal("test");
    });
  });

  describe("Patch", () => {
    it("should register route and middleware", () => {
      // WHEN
      class Test {
        @Patch("/")
        test() {}
      }

      const endpoint = EndpointMetadata.get(Test, "test");

      // THEN
      expect([...endpoint.operationPaths.values()]).to.deep.eq([
        {
          method: OperationMethods.PATCH,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).to.equal("test");
    });
  });

  describe("Options", () => {
    it("should register route and middleware", () => {
      // WHEN
      class Test {
        @Options("/")
        test() {}
      }

      const endpoint = EndpointMetadata.get(Test, "test");

      // THEN
      expect([...endpoint.operationPaths.values()]).to.deep.eq([
        {
          method: OperationMethods.OPTIONS,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).to.equal("test");
    });
  });
});
