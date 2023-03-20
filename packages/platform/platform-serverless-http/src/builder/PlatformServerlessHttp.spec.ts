import {PlatformExpress} from "@tsed/platform-express";
import {PlatformBuilder} from "@tsed/common";
import serverless from "serverless-http";
import {PlatformServerlessHttp} from "./PlatformServerlessHttp";

jest.mock("serverless-http");

class Server {}

describe("PlatformServerlessHttp", () => {
  beforeEach(() => {});
  it("should create a new serverless http app", async () => {
    const event = {};
    const context = {};
    const callback = jest.fn();
    const platform = {
      callback: jest.fn().mockReturnValue(callback),
      listen: jest.fn().mockResolvedValue(undefined)
    };
    jest.spyOn(PlatformBuilder, "create").mockReturnValue(platform as any);

    const handler = jest.fn();

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
