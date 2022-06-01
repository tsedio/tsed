import {All, Delete, EndpointMetadata, Get, Head, Options, Patch, Post, Put} from "@tsed/common";
import {OperationMethods} from "@tsed/schema";
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
      expect([...endpoint.operationPaths.values()]).toEqual([
        {
          method: OperationMethods.ALL,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toEqual("test");
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
      expect([...endpoint.operationPaths.values()]).toEqual([
        {
          method: OperationMethods.GET,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toEqual("test");
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
      expect([...endpoint.operationPaths.values()]).toEqual([
        {
          method: OperationMethods.GET,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toEqual("test");
      expect(endpoint.middlewares).toEqual([middleware]);
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
      expect([...endpoint.operationPaths.values()]).toEqual([
        {
          method: OperationMethods.POST,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toEqual("test");
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
      expect([...endpoint.operationPaths.values()]).toEqual([
        {
          method: OperationMethods.PUT,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toEqual("test");
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
      expect([...endpoint.operationPaths.values()]).toEqual([
        {
          method: OperationMethods.DELETE,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toEqual("test");
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
      expect([...endpoint.operationPaths.values()]).toEqual([
        {
          method: OperationMethods.HEAD,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toEqual("test");
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
      expect([...endpoint.operationPaths.values()]).toEqual([
        {
          method: OperationMethods.PATCH,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toEqual("test");
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
      expect([...endpoint.operationPaths.values()]).toEqual([
        {
          method: OperationMethods.OPTIONS,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toEqual("test");
    });
  });
});
