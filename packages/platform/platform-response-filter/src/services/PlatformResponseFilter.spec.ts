import {Context, EndpointMetadata, Get, PlatformContext, PlatformTest} from "@tsed/common";
import {Returns} from "@tsed/schema";
import {expect} from "chai";
import Sinon from "sinon";
import {ResponseFilter} from "../decorators/responseFilter";
import {ResponseFilterMethods} from "../interfaces/ResponseFilterMethods";
import {PlatformResponseFilter} from "./PlatformResponseFilter";

@ResponseFilter("custom/json")
class CustomJsonFilter implements ResponseFilterMethods {
  transform(data: unknown, ctx: Context) {
    return {data};
  }
}

const sandbox = Sinon.createSandbox();
describe("PlatformResponseFilter", () => {
  beforeEach(() =>
    PlatformTest.create({
      responseFilters: [CustomJsonFilter]
    })
  );
  afterEach(() => PlatformTest.reset());

  it("should transform data for custom/json", async () => {
    class Test {
      @Get("/")
      test() {}
    }

    const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);

    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(Test, "test");
    const data = {text: "test"};

    sandbox.stub(ctx.response, "contentType");
    sandbox.stub(ctx.response, "get");
    sandbox.stub(ctx.request, "get").returns("custom/json");
    sandbox.stub(ctx.request, "accepts").returns(["custom/json"]);

    const result = await platformResponseFilter.transform(data, ctx);

    expect(result).to.deep.equal({
      data: {
        text: "test"
      }
    });
  });

  it("should transform data for application/json", async () => {
    class Test {
      @Get("/")
      test() {}
    }

    const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);

    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(Test, "test");
    const data = {text: "test"};

    sandbox.stub(ctx.response, "contentType");
    sandbox.stub(ctx.response, "get");
    sandbox.stub(ctx.request, "get").returns("application/json");
    sandbox.stub(ctx.request, "accepts").returns(["application/json"]);

    const result = await platformResponseFilter.transform(data, ctx);

    expect(result).to.deep.equal({
      text: "test"
    });
  });
  it("should get content-type set from response", async () => {
    class Test {
      @Get("/")
      test() {}
    }

    const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);

    const ctx = PlatformTest.createRequestContext();
    ctx.endpoint = EndpointMetadata.get(Test, "test");
    const data = {text: "test"};

    sandbox.stub(ctx.response, "contentType");
    sandbox.stub(ctx.response, "get").returns("text/json; charset: utf-8");
    sandbox.stub(ctx.request, "get").returns("application/json");
    sandbox.stub(ctx.request, "accepts").returns(["application/json"]);

    const result = await platformResponseFilter.transform(data, ctx);

    expect(result).to.deep.equal({
      text: "test"
    });
  });
  it("should transform data for any content type", async () => {
    class Test {
      @Get("/")
      test() {}
    }

    const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);

    const ctx = PlatformTest.createRequestContext();
    const data = {text: "test"};
    ctx.endpoint = EndpointMetadata.get(Test, "test");

    sandbox.stub(ctx.response, "contentType");
    sandbox.stub(ctx.response, "get");
    sandbox.stub(ctx.request, "get").returns("application/json");
    sandbox.stub(ctx.request, "accepts").returns(["application/json"]);

    platformResponseFilter.types.set("*/*", {
      transform(data: unknown, ctx: PlatformContext) {
        return {data};
      }
    });

    const result = await platformResponseFilter.transform(data, ctx);

    expect(result).to.deep.equal({
      data: {
        text: "test"
      }
    });
  });
  it("should transform data for default content-type from metadata", async () => {
    class Test {
      @Get("/")
      @Returns(200).ContentType("application/json")
      test() {}
    }

    const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);

    const ctx = PlatformTest.createRequestContext();
    const data = {text: "test"};
    ctx.endpoint = EndpointMetadata.get(Test, "test");

    sandbox.stub(ctx.response, "contentType");
    sandbox.stub(ctx.response, "get");
    sandbox.stub(ctx.request, "get").returns(undefined);
    sandbox.stub(ctx.request, "accepts").returns(false);

    const result = await platformResponseFilter.transform(data, ctx);

    expect(result).to.deep.equal({
      text: "test"
    });
  });
  it("should transform data for default content-type from metadata with any response filter", async () => {
    class Test {
      @Get("/")
      @Returns(200).ContentType("application/json")
      test() {}
    }

    const platformResponseFilter = PlatformTest.get<PlatformResponseFilter>(PlatformResponseFilter);

    const ctx = PlatformTest.createRequestContext();
    const data = {text: "test"};
    ctx.endpoint = EndpointMetadata.get(Test, "test");

    platformResponseFilter.types.set("*/*", {
      transform(data: unknown, ctx: PlatformContext) {
        return {data};
      }
    });

    sandbox.stub(ctx.response, "contentType");
    sandbox.stub(ctx.response, "get");
    sandbox.stub(ctx.request, "get").returns(undefined);
    sandbox.stub(ctx.request, "accepts").returns(false);

    const result = await platformResponseFilter.transform(data, ctx);

    expect(result).to.deep.equal({
      data: {
        text: "test"
      }
    });
  });
});
