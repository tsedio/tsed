import {PlatformExpress} from "@tsed/platform-express";
import {PlatformBuilder} from "@tsed/platform-http";
import serverless from "serverless-http";

import {PlatformServerlessHttp} from "./PlatformServerlessHttp.js";

vi.mock("serverless-http");

class Server {}

describe("PlatformServerlessHttp", () => {
  beforeEach(() => {});
  it("should create a new serverless http app", async () => {
    const event = {};
    const context = {};
    const callback = vi.fn();
    const platform = {
      callback: vi.fn().mockReturnValue(callback),
      listen: vi.fn().mockResolvedValue(undefined)
    };
    vi.spyOn(PlatformBuilder, "create").mockReturnValue(platform as any);

    const handler = vi.fn();

    (serverless as any).mockReturnValue(handler);

    const instance = PlatformServerlessHttp.bootstrap(Server, {
      adapter: PlatformExpress
    });

    const h: any = instance.handler();

    await h(event, context);

    expect(serverless).toHaveBeenCalledWith(callback, {
      request: expect.any(Function)
    });
    expect(handler).toHaveBeenCalledWith(event, context);
  });
});
