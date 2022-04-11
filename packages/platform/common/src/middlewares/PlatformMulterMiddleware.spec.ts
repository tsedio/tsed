import {EndpointMetadata, MulterOptions, MultipartFile, PlatformApplication, PlatformMulterMiddleware, PlatformTest} from "@tsed/common";
import {Exception} from "@tsed/exceptions";
import {expect} from "chai";
import Sinon from "sinon";
import {MulterError} from "multer";
import {catchAsyncError} from "@tsed/core";

const sandbox = Sinon.createSandbox();

async function build(options = {}) {
  class Test {
    @MulterOptions(options)
    upload(@MultipartFile("file1") file1: any) {}
  }

  const multerMiddleware = sandbox.stub();
  const multer = {
    fields: sandbox.stub().returns(multerMiddleware)
  };
  const app = {
    multer: sandbox.stub().returns(multer)
  };

  const middleware = await PlatformTest.invoke<PlatformMulterMiddleware>(PlatformMulterMiddleware, [
    {
      token: PlatformApplication,
      use: app
    }
  ]);
  const ctx = PlatformTest.createRequestContext();
  ctx.endpoint = EndpointMetadata.get(Test, "upload");

  return {middleware, ctx, multer, app, multerMiddleware};
}

describe("PlatformMulterMiddleware", () => {
  beforeEach(() =>
    PlatformTest.create({
      multer: {
        dest: "/dest"
      }
    })
  );
  afterEach(() => PlatformTest.reset());
  it("should create middleware", async () => {
    const {middleware, ctx, multer, app, multerMiddleware} = await build({});

    await middleware.use(ctx);

    expect(app.multer).to.have.been.calledWithExactly({
      dest: "/dest"
    });
    expect(multer.fields).to.have.been.calledWithExactly([{maxCount: undefined, name: "file1"}]);
    expect(multerMiddleware).to.have.been.calledWithExactly(ctx.request.raw, ctx.response.raw);
  });
  it("should create middleware with storage", async () => {
    const {middleware, ctx, multer, app, multerMiddleware} = await build({
      storage: "storage"
    });

    await middleware.use(ctx);

    expect(app.multer).to.have.been.calledWithExactly({
      storage: "storage"
    });
    expect(multer.fields).to.have.been.calledWithExactly([{maxCount: undefined, name: "file1"}]);
    expect(multerMiddleware).to.have.been.calledWithExactly(ctx.request.raw, ctx.response.raw);
  });
  it("should catch error with code", async () => {
    const {middleware, ctx, multerMiddleware} = await build();
    const error = new MulterError("LIMIT_FILE_SIZE", "field");

    multerMiddleware.rejects(error);

    const actualError: any | undefined = await catchAsyncError(() => middleware.use(ctx));

    expect(actualError).to.be.instanceof(Exception);
    expect(actualError?.message).to.eq("File too large");
    expect(actualError?.status).to.eq(400);
  });
  it("should throw error without code", async () => {
    const {middleware, ctx, multerMiddleware} = await build();

    multerMiddleware.rejects(new Error("test"));

    let actualError: any;
    try {
      await middleware.use(ctx);
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).to.eq("test");
  });
});
