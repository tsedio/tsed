import {EndpointMetadata, Err, Get, HandlerType, PlatformTest, QueryParams, useCtxHandler} from "@tsed/common";
import {Provider} from "@tsed/di";
import {expect} from "chai";
import Sinon from "sinon";
import {createHandlerMetadata} from "./createHandlerMetadata";

const sandbox = Sinon.createSandbox();

class Test {
  @Get("/")
  get(@QueryParams("test") v: string) {
    return v;
  }

  use(@Err() error: any) {
    return error;
  }

  useErr(err: any, req: any, res: any, next: any) {}
}

describe("createHandlerMetadata", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  afterEach(() => {
    sandbox.restore();
  });

  it("should return metadata from Endpoint", async () => {
    // GIVEN

    const endpoint = new EndpointMetadata({
      target: Test,
      propertyKey: "get"
    });

    sandbox.stub(PlatformTest.injector, "getProvider").returns(new Provider(Test));

    // WHEN
    const handlerMetadata = createHandlerMetadata(PlatformTest.injector, endpoint);

    // THEN
    expect(handlerMetadata.target).to.eq(Test);
    expect(handlerMetadata.propertyKey).to.eq("get");
    expect(handlerMetadata.type).to.eq(HandlerType.ENDPOINT);
  });
  it("should return metadata from Middleware", async () => {
    // GIVEN
    sandbox.stub(PlatformTest.injector, "getProvider").returns(new Provider(Test));

    // WHEN
    const handlerMetadata = createHandlerMetadata(PlatformTest.injector, Test);

    // THEN
    expect(handlerMetadata.target).to.eq(Test);
    expect(handlerMetadata.propertyKey).to.eq("use");
    expect(handlerMetadata.type).to.eq(HandlerType.ERR_MIDDLEWARE);
  });
  it("should return metadata from Function", async () => {
    // GIVEN
    sandbox.stub(PlatformTest.injector, "getProvider").returns(undefined);

    // WHEN
    const handlerMetadata = createHandlerMetadata(PlatformTest.injector, () => {});

    // THEN
    expect(handlerMetadata.type).to.eq(HandlerType.RAW_FN);
  });
  it("should return metadata from useCtxHandler", async () => {
    // GIVEN
    sandbox.stub(PlatformTest.injector, "getProvider").returns(undefined);

    // WHEN
    const handlerMetadata = createHandlerMetadata(
      PlatformTest.injector,
      useCtxHandler(() => {})
    );

    // THEN
    expect(handlerMetadata.type).to.eq(HandlerType.CTX_FN);
  });
});
