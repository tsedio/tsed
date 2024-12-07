import {PlatformTest} from "@tsed/platform-http/testing";
import {EndpointMetadata, Get, Returns, View} from "@tsed/schema";

import {PLATFORM_CONTENT_TYPE_RESOLVER} from "./PlatformContentTypeResolver.js";
import {PLATFORM_CONTENT_TYPES_CONTAINER} from "./PlatformContentTypesContainer.js";

async function getTestFixture(contentTypes = ["application/json", "text/html"]) {
  const contentTypeResolver = await PlatformTest.invoke<PLATFORM_CONTENT_TYPE_RESOLVER>(PLATFORM_CONTENT_TYPE_RESOLVER, [
    {
      token: PLATFORM_CONTENT_TYPES_CONTAINER,
      use: {
        contentTypes
      }
    }
  ]);

  const data = {
    test: "test"
  };

  const ctx = PlatformTest.createRequestContext();
  return {
    data,
    ctx,
    contentTypeResolver
  };
}

describe("PlatformContentTypeResolver", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should return the content type (undefined)", async () => {
    class TestController {
      @Get("/")
      get() {}
    }

    const {contentTypeResolver, ctx, data} = await getTestFixture();

    ctx.endpoint = EndpointMetadata.get(TestController, "get");

    const result = await contentTypeResolver(data, ctx);

    expect(result).toEqual(undefined);
  });
  it("should return the content type (object - application/json)", async () => {
    class TestController {
      @Get("/")
      @(Returns(200).ContentType("application/json"))
      get() {}
    }

    const {contentTypeResolver, ctx, data} = await getTestFixture();

    ctx.endpoint = EndpointMetadata.get(TestController, "get");
    ctx.response.getRes().statusCode = 200;

    vi.spyOn(ctx.response, "getContentType").mockReturnValue("application/json");

    const result = contentTypeResolver(data, ctx);

    expect(result).toEqual("application/json");
  });
  it("should return the content type (string - application/json)", async () => {
    class TestController {
      @Get("/")
      @(Returns(200).ContentType("application/json"))
      get() {}
    }

    const {contentTypeResolver, ctx, data} = await getTestFixture();

    ctx.endpoint = EndpointMetadata.get(TestController, "get");
    ctx.response.getRes().statusCode = 200;
    vi.spyOn(ctx.response, "getContentType").mockReturnValue("application/json");

    const result = contentTypeResolver(data, ctx);

    expect(result).toEqual("application/json");
  });
  it("should return the content type (string - text/html)", async () => {
    class TestController {
      @Get("/")
      @(Returns(200).ContentType("text/html"))
      get() {}
    }

    const {contentTypeResolver, ctx, data} = await getTestFixture();

    ctx.endpoint = EndpointMetadata.get(TestController, "get");
    ctx.response.getRes().statusCode = 200;
    vi.spyOn(ctx.response, "getContentType").mockReturnValue("text/html");

    const result = contentTypeResolver(data, ctx);

    expect(result).toEqual("text/html");
  });
  it("should return the content type (string - view)", async () => {
    class TestController {
      @Get("/")
      @Returns(200)
      @View("view.html")
      get() {}
    }

    const {contentTypeResolver, ctx, data} = await getTestFixture();

    ctx.endpoint = EndpointMetadata.get(TestController, "get");
    ctx.response.getRes().statusCode = 200;
    ctx.view = "true";

    const result = contentTypeResolver(data, ctx);

    expect(result).toEqual("text/html");
  });
});
