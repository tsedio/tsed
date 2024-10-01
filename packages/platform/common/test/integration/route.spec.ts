import {All, Delete, EndpointMetadata, Get, Head, OperationVerbs, Options, Patch, Post, Put} from "@tsed/schema";

describe("Route decorators", () => {
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
          method: OperationVerbs.ALL,
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
          method: OperationVerbs.GET,
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
          method: OperationVerbs.GET,
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
          method: OperationVerbs.POST,
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
          method: OperationVerbs.PUT,
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
          method: OperationVerbs.DELETE,
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
          method: OperationVerbs.HEAD,
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
          method: OperationVerbs.PATCH,
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
          method: OperationVerbs.OPTIONS,
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).toEqual("test");
    });
  });
});
