import {PlatformExpressHandler} from "./PlatformExpressHandler.js";

jest.mock("@tsed/common");

describe("PlatformExpressHandler", () => {
  it("should call middleware", async () => {
    const instance = new PlatformExpressHandler({
      hooks: {
        on: jest.fn().mockReturnThis()
      }
    } as any);

    const response: any = {};
    const $ctx: any = {
      getRequest: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnThis()
    };
    $ctx.data = (req: any, res: any, cb: any) => {
      cb();
    };

    await instance.onResponse(response, $ctx);
  });
});
