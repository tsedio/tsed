import {PlatformTest} from "@tsed/common";
import {catchAsyncError} from "@tsed/core";
import {Unauthorized} from "@tsed/exceptions";
import {FormioAuthMiddleware, FormioService} from "@tsed/formio";
import {expect} from "chai";
import Sinon from "sinon";

const sandbox = Sinon.createSandbox();

describe("FormioAuthMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should authorize user", async () => {
    const formio = {
      middleware: {
        tokenHandler: sandbox.stub().callsFake((request: any, response: any, next: any) => {
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

    expect(formio.middleware.tokenHandler).to.have.been.calledWithExactly(ctx.getRequest(), ctx.getResponse(), Sinon.match.func);
  });
  it("should throw error", async () => {
    const formio = {
      middleware: {
        tokenHandler: sandbox.stub().callsFake((request: any, response: any, next: any) => {
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

    expect(error).to.be.instanceof(Unauthorized);
  });
});
