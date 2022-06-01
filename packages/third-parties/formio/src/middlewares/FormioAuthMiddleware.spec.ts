import {PlatformTest} from "@tsed/common";
import {catchAsyncError} from "@tsed/core";
import {Unauthorized} from "@tsed/exceptions";
import {FormioAuthMiddleware, FormioService} from "@tsed/formio";

describe("FormioAuthMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should authorize user", async () => {
    const formio = {
      middleware: {
        tokenHandler: jest.fn().mockImplementation((request: any, response: any, next: any) => {
          request.token = {
            user: {
              _id: "id"
            }
          };
          next();
        })
      }
    };

    const middleware = await PlatformTest.invoke<FormioAuthMiddleware>(FormioAuthMiddleware, [
      {
        token: FormioService,
        use: formio
      }
    ]);

    const ctx = PlatformTest.createRequestContext();

    await middleware.use(ctx);

    expect(formio.middleware.tokenHandler).toHaveBeenCalledWith(ctx.getRequest(), ctx.getResponse(), expect.any(Function));
  });
  it("should throw error", async () => {
    const formio = {
      middleware: {
        tokenHandler: jest.fn().mockImplementation((request: any, response: any, next: any) => {
          next();
        })
      }
    };

    const middleware = await PlatformTest.invoke<FormioAuthMiddleware>(FormioAuthMiddleware, [
      {
        token: FormioService,
        use: formio
      }
    ]);

    const ctx = PlatformTest.createRequestContext();

    const error = await catchAsyncError(() => middleware.use(ctx));

    expect(error).toBeInstanceOf(Unauthorized);
  });
});
