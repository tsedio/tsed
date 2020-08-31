import {All, Delete, Get, Head, Options, Patch, Post, Put, EndpointMetadata} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";

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
      expect(endpoint.pathsMethods).to.deep.eq([
        {
          method: "all",
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
      expect(endpoint.pathsMethods).to.deep.eq([
        {
          method: "get",
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
      expect(endpoint.pathsMethods).to.deep.eq([
        {
          method: "get",
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
      expect(endpoint.pathsMethods).to.deep.eq([
        {
          method: "post",
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
      expect(endpoint.pathsMethods).to.deep.eq([
        {
          method: "put",
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
      expect(endpoint.pathsMethods).to.deep.eq([
        {
          method: "delete",
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
      expect(endpoint.pathsMethods).to.deep.eq([
        {
          method: "head",
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
      expect(endpoint.pathsMethods).to.deep.eq([
        {
          method: "patch",
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
      expect(endpoint.pathsMethods).to.deep.eq([
        {
          method: "options",
          path: "/"
        }
      ]);
      expect(endpoint.propertyKey).to.equal("test");
    });
  });
});
