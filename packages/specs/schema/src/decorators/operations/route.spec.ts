import {JsonEntityStore, OperationMethods} from "@tsed/schema";
import {All, Delete, Get, Head, Options, Patch, Post, Put} from "./route";
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

      const endpoint = JsonEntityStore.fromMethod(Test, "test");

      // THEN
      expect([...endpoint.operation!.operationPaths.values()]).to.deep.eq([
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

      const endpoint = JsonEntityStore.fromMethod(Test, "test");

      // THEN
      expect([...endpoint.operation!.operationPaths.values()]).to.deep.eq([
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

      const endpoint = JsonEntityStore.fromMethod(Test, "test");

      // THEN
      expect([...endpoint.operation!.operationPaths.values()]).to.deep.eq([
        {
          method: OperationMethods.GET,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).to.equal("test");
    });
    it("should register route and middleware (with handler)", () => {
      const middleware = () => {};
      const beforeMiddleware = () => {};
      const afterMiddleware = () => {};

      // WHEN
      class Test {
        @(Get("/").UseBefore(beforeMiddleware).Use(middleware).UseAfter(afterMiddleware))
        test() {}
      }

      const endpoint = JsonEntityStore.fromMethod(Test, "test");
      expect(endpoint.middlewares).to.deep.equal([middleware]);
      expect(endpoint.afterMiddlewares).to.deep.equal([afterMiddleware]);
      expect(endpoint.beforeMiddlewares).to.deep.equal([beforeMiddleware]);
    });
  });

  describe("Post", () => {
    it("should register route and middleware", () => {
      // WHEN
      class Test {
        @Post("/")
        test() {}
      }

      const endpoint = JsonEntityStore.fromMethod(Test, "test");

      // THEN
      expect([...endpoint.operation!.operationPaths.values()]).to.deep.eq([
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
        @(Put("/").Id("operationId").Summary("Summary").Description("Description"))
        test() {}
      }

      const endpoint = JsonEntityStore.fromMethod(Test, "test");

      // THEN
      expect([...endpoint.operation!.operationPaths.values()]).to.deep.eq([
        {
          method: OperationMethods.PUT,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).to.equal("test");
      expect(endpoint.operation!.get("description")).to.equal("Description");
      expect(endpoint.operation!.get("summary")).to.equal("Summary");
      expect(endpoint.operation!.get("operationId")).to.equal("operationId");
    });
  });

  describe("Delete", () => {
    it("should register route and middleware", () => {
      // WHEN
      class Test {
        @Delete("/")
        test() {}
      }

      const endpoint = JsonEntityStore.fromMethod(Test, "test");

      // THEN
      expect([...endpoint.operation!.operationPaths.values()]).to.deep.eq([
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

      const endpoint = JsonEntityStore.fromMethod(Test, "test");

      // THEN
      expect([...endpoint.operation!.operationPaths.values()]).to.deep.eq([
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

      const endpoint = JsonEntityStore.fromMethod(Test, "test");

      // THEN
      expect([...endpoint.operation!.operationPaths.values()]).to.deep.eq([
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

      const endpoint = JsonEntityStore.fromMethod(Test, "test");

      // THEN
      expect([...endpoint.operation!.operationPaths.values()]).to.deep.eq([
        {
          method: OperationMethods.OPTIONS,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).to.equal("test");
    });
  });
});
