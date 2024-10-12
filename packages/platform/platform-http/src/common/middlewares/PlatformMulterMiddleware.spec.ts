import {catchAsyncError} from "@tsed/core";
import {Exception} from "@tsed/exceptions";
import {MulterError} from "multer";

import {PlatformTest} from "../../testing/PlatformTest.js";
import {MulterOptions} from "../decorators/multer/multerOptions.js";
import {MultipartFile} from "../decorators/multer/multipartFile.js";
import {EndpointMetadata} from "../domain/EndpointMetadata.js";
import {PlatformApplication} from "../services/PlatformApplication.js";
import {PlatformMulterMiddleware} from "./PlatformMulterMiddleware.js";

async function build(options = {}) {
  class Test {
    @MulterOptions(options)
    upload(@MultipartFile("file1") file1: any) {}
  }

  const multerMiddleware = vi.fn();
  const multer = {
    fields: vi.fn().mockReturnValue(multerMiddleware)
  };
  const app = {
    multer: vi.fn().mockReturnValue(multer)
  };

  const middleware = await PlatformTest.invoke<PlatformMulterMiddleware>(PlatformMulterMiddleware, [
    {
      token: PlatformApplication,
      use: app
    }
  ]);
  const ctx: any = PlatformTest.createRequestContext();
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

    expect(app.multer).toHaveBeenCalledWith({
      dest: "/dest"
    });
    expect(multer.fields).toHaveBeenCalledWith([{maxCount: undefined, name: "file1"}]);
    expect(multerMiddleware).toHaveBeenCalledWith(ctx.request.raw, ctx.response.raw);
  });
  it("should create middleware with storage", async () => {
    const {middleware, ctx, multer, app, multerMiddleware} = await build({
      storage: "storage"
    });

    await middleware.use(ctx);

    expect(app.multer).toHaveBeenCalledWith({
      storage: "storage"
    });
    expect(multer.fields).toHaveBeenCalledWith([{maxCount: undefined, name: "file1"}]);
    expect(multerMiddleware).toHaveBeenCalledWith(ctx.request.raw, ctx.response.raw);
  });
  it("should catch error with code", async () => {
    const {middleware, ctx, multerMiddleware} = await build();
    const error = new MulterError("LIMIT_FILE_SIZE", "field");

    multerMiddleware.mockRejectedValue(error);

    const actualError: any | undefined = await catchAsyncError(() => middleware.use(ctx));

    expect(actualError).toBeInstanceOf(Exception);
    expect(actualError?.message).toEqual("File too large");
    expect(actualError?.status).toEqual(400);
  });
  it("should throw error without code", async () => {
    const {middleware, ctx, multerMiddleware} = await build();

    multerMiddleware.mockRejectedValue(new Error("test"));

    let actualError: any;
    try {
      await middleware.use(ctx);
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).toEqual("test");
  });
});
