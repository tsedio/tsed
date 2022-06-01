import {PlatformTest} from "@tsed/common";
import {BYNARY_MIME_TYPES, PlatformAws} from "@tsed/platform-aws";
import "@tsed/platform-express";
import {PlatformExpress} from "@tsed/platform-express";
import aws from "aws-serverless-express";

class Server {}

describe("PlatformAws", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);

  beforeEach(() => {
    jest.spyOn(aws, "createServer").mockImplementation((app: any, cb: any) => {
      cb();

      return {server: "serve"} as any;
    });
    jest.spyOn(aws, "proxy").mockResolvedValue(undefined as never);
  });
  afterEach(() => jest.resetAllMocks());
  it("should create aws server", async () => {
    PlatformAws.bootstrap(Server, {
      platform: PlatformExpress,
      logger: {level: "off"}
    });

    await PlatformAws.promise;

    expect(aws.createServer).toBeCalledWith(PlatformAws.platform.app.callback(), expect.any(Function), BYNARY_MIME_TYPES);

    const handler = PlatformAws.callback();

    await handler({event: "event"}, {context: "context"});

    expect(aws.proxy).toBeCalledWith({server: "serve"}, {event: "event"}, {context: "context"}, "PROMISE");
  });
});
