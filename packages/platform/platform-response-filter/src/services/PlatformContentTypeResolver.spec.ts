import {PlatformTest} from "@tsed/platform-http/testing";
import {EndpointMetadata, Get, Returns, View} from "@tsed/schema";
import {createReadStream} from "fs";

import {ContentTypes} from "../constants/ContentTypes.js";
import {PLATFORM_CONTENT_TYPE_RESOLVER} from "./PlatformContentTypeResolver.js";
import {PLATFORM_CONTENT_TYPES_CONTAINER} from "./PlatformContentTypesContainer.js";

async function getTestFixture(contentTypes = [ContentTypes.JSON, ContentTypes.HTML]) {
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

  it("should return the content type (undefined | Buffer)", async () => {
    class TestController {
      @Get("/")
      get() {}
    }

    const {contentTypeResolver, ctx, data} = await getTestFixture();

    ctx.endpoint = EndpointMetadata.get(TestController, "get");

    const result = await contentTypeResolver(Buffer.from("data"), ctx);

    expect(result).toEqual(undefined);
  });
  it("should return the content type (undefined | Stream)", async () => {
    class TestController {
      @Get("/")
      get() {}
    }

    const stream = createReadStream(`${import.meta.dirname}/__mock__/response.txt`);

    const {contentTypeResolver, ctx, data} = await getTestFixture();

    ctx.endpoint = EndpointMetadata.get(TestController, "get");

    const result = await contentTypeResolver(stream, ctx);

    expect(result).toEqual(undefined);
  });
  it("should return the content type (object - empty resolve content type - application/json)", async () => {
    class TestController {
      @Get("/")
      get() {}
    }

    const {contentTypeResolver, ctx, data} = await getTestFixture();

    ctx.endpoint = EndpointMetadata.get(TestController, "get");

    const result = await contentTypeResolver(data, ctx);

    expect(result).toEqual("application/json");
  });
  it("should return the content type (object - application/json)", async () => {
    class TestController {
      @Get("/")
      @(Returns(200).ContentType(ContentTypes.JSON))
      get() {}
    }

    const {contentTypeResolver, ctx, data} = await getTestFixture();

    ctx.endpoint = EndpointMetadata.get(TestController, "get");
    ctx.response.getRes().statusCode = 200;

    vi.spyOn(ctx.response, "getContentType").mockReturnValue(ContentTypes.JSON);

    const result = contentTypeResolver(data, ctx);

    expect(result).toEqual(ContentTypes.JSON);
  });
  it("should return the content type (object - custom content-type)", async () => {
    class TestController {
      @Get("/")
      @(Returns(200).ContentType("application/vnd.custom+json"))
      get() {}
    }

    const {contentTypeResolver, ctx, data} = await getTestFixture();

    ctx.endpoint = EndpointMetadata.get(TestController, "get");
    ctx.response.getRes().statusCode = 200;

    vi.spyOn(ctx.response, "getContentType").mockReturnValue("application/vnd.custom+json");

    const result = contentTypeResolver(data, ctx);

    expect(result).toEqual("application/vnd.custom+json");
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
  it("should return the content type (boolean - application/json)", async () => {
    class TestController {
      @Get("/")
      @Returns(200)
      get() {}
    }

    const {contentTypeResolver, ctx, data} = await getTestFixture();

    ctx.endpoint = EndpointMetadata.get(TestController, "get");
    ctx.response.getRes().statusCode = 200;
    vi.spyOn(ctx.response, "getContentType").mockReturnValue("application/json");

    const result = contentTypeResolver(true, ctx);

    expect(result).toEqual("application/json");
  });
  it("should return the content type (string - text/html)", async () => {
    class TestController {
      @Get("/")
      @(Returns(200).ContentType(ContentTypes.HTML))
      get() {}
    }

    const {contentTypeResolver, ctx, data} = await getTestFixture();

    ctx.endpoint = EndpointMetadata.get(TestController, "get");
    ctx.response.getRes().statusCode = 200;
    vi.spyOn(ctx.response, "getContentType").mockReturnValue(ContentTypes.HTML);

    const result = contentTypeResolver(data, ctx);

    expect(result).toEqual(ContentTypes.HTML);
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

    expect(result).toEqual(ContentTypes.HTML);
  });
});
