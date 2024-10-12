import {PlatformExpressHandler} from "./PlatformExpressHandler.js";

vi.mock("@tsed/platform-http");

describe("PlatformExpressHandler", () => {
  it("should call middleware", async () => {
    const instance = new PlatformExpressHandler({
      hooks: {
        on: vi.fn().mockReturnThis()
      }
    } as any);

    const response: any = {};
    const $ctx: any = {
      getRequest: vi.fn().mockReturnThis(),
      getResponse: vi.fn().mockReturnThis()
    };
    $ctx.data = (req: any, res: any, cb: any) => {
      cb();
    };

    await instance.onResponse(response, $ctx);
  });
});
