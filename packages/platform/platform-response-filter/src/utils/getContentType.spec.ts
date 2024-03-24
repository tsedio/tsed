import {PlatformTest, View} from "@tsed/common";
import {EndpointMetadata, Get, Returns} from "@tsed/schema";
import {getContentType} from "./getContentType";

describe("getContentType", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should return the content type (application/json) if the data is an object", () => {
    class TestController {
      @Get("/")
      get() {}
    }

    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(TestController, "get");

    const result = getContentType(
      {
        test: "test"
      },
      ctx
    );

    expect(result).toEqual("application/json");
  });

  it("should return the content type (Buffer -> undefined)", () => {
    class TestController {
      @Get("/")
      get(): Buffer {
        return Buffer.from("test");
      }
    }

    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(TestController, "get");

    const result = getContentType(Buffer.from("test"), ctx);

    expect(result).toEqual(undefined);
  });
  it("should return the content type (object - application/json)", () => {
    class TestController {
      @Get("/")
      @Returns(200).ContentType("application/json")
      get() {}
    }

    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(TestController, "get");
    ctx.response.getRes().statusCode = 200;
    jest.spyOn(ctx.response, "getContentType").mockReturnValue("application/json");

    const result = getContentType(
      {
        test: "test"
      },
      ctx
    );

    expect(result).toEqual("application/json");
  });
  it("should return the content type (string - application/json)", () => {
    class TestController {
      @Get("/")
      @Returns(200).ContentType("application/json")
      get() {}
    }

    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(TestController, "get");
    ctx.response.getRes().statusCode = 200;
    jest.spyOn(ctx.response, "getContentType").mockReturnValue("application/json");

    const result = getContentType(
      {
        test: "test"
      },
      ctx
    );

    expect(result).toEqual("application/json");
  });
  it("should return the content type (string - text/html)", () => {
    class TestController {
      @Get("/")
      @Returns(200).ContentType("text/html")
      get() {}
    }

    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(TestController, "get");
    ctx.response.getRes().statusCode = 200;
    jest.spyOn(ctx.response, "getContentType").mockReturnValue("text/html");

    const result = getContentType(
      {
        test: "test"
      },
      ctx
    );

    expect(result).toEqual("text/html");
  });
  it("should return the content type (string - view)", () => {
    class TestController {
      @Get("/")
      @Returns(200)
      @View("view.html")
      get() {}
    }

    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(TestController, "get");
    ctx.response.getRes().statusCode = 200;
    ctx.view = "true";

    const result = getContentType(
      {
        test: "test"
      },
      ctx
    );

    expect(result).toEqual("text/html");
  });
});
