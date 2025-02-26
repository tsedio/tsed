import {catchAsyncError} from "@tsed/core";
import {inject} from "@tsed/di";
import {Exception} from "@tsed/exceptions";
import {MulterError} from "multer";

import {PlatformTest} from "../../testing/PlatformTest.js";
import {MulterOptions} from "../decorators/multer/multerOptions.js";
import {MultipartFile} from "../decorators/multer/multipartFile.js";
import {EndpointMetadata} from "../domain/EndpointMetadata.js";
import {PlatformAdapter} from "../services/PlatformAdapter.js";
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

  const middleware = inject(PlatformMulterMiddleware);
  const ctx: any = PlatformTest.createRequestContext();
  ctx.endpoint = EndpointMetadata.get(Test, "upload");

  const adapter = inject(PlatformAdapter);

  vi.spyOn(adapter, "multipart").mockReturnValue(multer as any);

  return {middleware, ctx, multer, adapter, multerMiddleware};
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
    const {middleware, ctx, multer, adapter, multerMiddleware} = await build({});

    await middleware.use(ctx);

    expect(adapter.multipart).toHaveBeenCalledWith({
      dest: "/dest"
    });
    expect(multer.fields).toHaveBeenCalledWith([{maxCount: undefined, name: "file1"}]);
    expect(multerMiddleware).toHaveBeenCalledWith(ctx.request.raw, ctx.response.raw);
  });
  it("should create middleware with storage", async () => {
    const {middleware, ctx, multer, adapter, multerMiddleware} = await build({
      storage: "storage"
    });

    await middleware.use(ctx);

    expect(adapter.multipart).toHaveBeenCalledWith({
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
