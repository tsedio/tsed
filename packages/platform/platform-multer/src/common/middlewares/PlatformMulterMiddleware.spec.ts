import {catchAsyncError} from "@tsed/core";
import {inject, injectable} from "@tsed/di";
import {Exception} from "@tsed/exceptions";
import {EndpointMetadata} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {MulterError} from "multer";

import {MULTER_MODULE} from "../constants/constants.js";
import {MulterOptions} from "../decorators/multerOptions.js";
import {MultipartFile} from "../decorators/multipartFile.js";
import {PlatformMulterMiddleware} from "./PlatformMulterMiddleware.js";

async function getFixture(options = {}) {
  class Test {
    @MulterOptions(options)
    upload(@MultipartFile("file1") file1: any) {}
  }

  const multerMiddleware = vi.fn();
  const multer = {
    fields: vi.fn().mockReturnValue(multerMiddleware)
  };

  injectable(MULTER_MODULE).factory(() => {
    return {
      get: vi.fn().mockReturnValue(multer)
    };
  });

  const middleware = await inject<PlatformMulterMiddleware>(PlatformMulterMiddleware);
  const ctx: any = PlatformTest.createRequestContext();
  ctx.endpoint = EndpointMetadata.get(Test, "upload");

  const multerModuleFactory = inject<{get: any}>(MULTER_MODULE);

  return {middleware, ctx, multer, multerModuleFactory, multerMiddleware};
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
    const {middleware, ctx, multer, multerModuleFactory, multerMiddleware} = await getFixture({});

    await middleware.use(ctx);

    expect(multerModuleFactory.get).toHaveBeenCalledWith({
      dest: "/dest"
    });
    expect(multer.fields).toHaveBeenCalledWith([{maxCount: undefined, name: "file1"}]);
    expect(multerMiddleware).toHaveBeenCalledWith(ctx.request.raw, ctx.response.raw);
  });
  it("should create middleware with storage", async () => {
    const {middleware, ctx, multer, multerModuleFactory, multerMiddleware} = await getFixture({
      storage: "storage"
    });

    await middleware.use(ctx);

    expect(multerModuleFactory.get).toHaveBeenCalledWith({
      storage: "storage"
    });
    expect(multer.fields).toHaveBeenCalledWith([{maxCount: undefined, name: "file1"}]);
    expect(multerMiddleware).toHaveBeenCalledWith(ctx.request.raw, ctx.response.raw);
  });
  it("should catch error with code", async () => {
    const {middleware, ctx, multerMiddleware} = await getFixture();
    const error = new MulterError("LIMIT_FILE_SIZE", "field");

    multerMiddleware.mockRejectedValue(error);

    const actualError: any | undefined = await catchAsyncError(() => middleware.use(ctx));

    expect(actualError).toBeInstanceOf(Exception);
    expect(actualError?.message).toEqual("File too large");
    expect(actualError?.status).toEqual(400);
  });
  it("should throw error without code", async () => {
    const {middleware, ctx, multerMiddleware} = await getFixture();

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
