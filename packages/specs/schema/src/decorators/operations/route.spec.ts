import {JsonEntityStore, OperationVerbs} from "../../index.js";
import {All, Delete, Get, Head, Options, Patch, Post, Put} from "./route.js";

describe("Route decorators", () => {
  describe("All", () => {
    it("should register route and middleware (1)", () => {
      // WHEN
      class Test {
        @All("/")
        test() {}
      }

      const endpoint = JsonEntityStore.fromMethod(Test, "test");

      // THEN
      expect([...endpoint.operation!.operationPaths.values()]).toEqual([
        {
          method: OperationVerbs.ALL,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toBe("test");
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
      expect([...endpoint.operation!.operationPaths.values()]).toEqual([
        {
          method: OperationVerbs.GET,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toBe("test");
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
      expect([...endpoint.operation!.operationPaths.values()]).toEqual([
        {
          method: OperationVerbs.GET,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toBe("test");
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
      expect(endpoint.middlewares).toEqual([middleware]);
      expect(endpoint.afterMiddlewares).toEqual([afterMiddleware]);
      expect(endpoint.beforeMiddlewares).toEqual([beforeMiddleware]);
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
      expect([...endpoint.operation!.operationPaths.values()]).toEqual([
        {
          method: OperationVerbs.POST,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toBe("test");
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
      expect([...endpoint.operation!.operationPaths.values()]).toEqual([
        {
          method: OperationVerbs.PUT,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toBe("test");
      expect(endpoint.operation!.get("description")).toBe("Description");
      expect(endpoint.operation!.get("summary")).toBe("Summary");
      expect(endpoint.operation!.get("operationId")).toBe("operationId");
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
      expect([...endpoint.operation!.operationPaths.values()]).toEqual([
        {
          method: OperationVerbs.DELETE,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toBe("test");
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
      expect([...endpoint.operation!.operationPaths.values()]).toEqual([
        {
          method: OperationVerbs.HEAD,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toBe("test");
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
      expect([...endpoint.operation!.operationPaths.values()]).toEqual([
        {
          method: OperationVerbs.PATCH,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toBe("test");
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
      expect([...endpoint.operation!.operationPaths.values()]).toEqual([
        {
          method: OperationVerbs.OPTIONS,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toBe("test");
    });
  });
});
