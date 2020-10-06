import {PlatformTest} from "@tsed/common";
import {BYNARY_MIME_TYPES, PlatformAws} from "@tsed/platform-aws";
import "@tsed/platform-express";
import {PlatformExpress} from "@tsed/platform-express";
import * as aws from "aws-serverless-express";
import {expect} from "chai";
import * as Sinon from "sinon";

const sandbox = Sinon.createSandbox();

class Server {}

describe("PlatformAws", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);

  beforeEach(() => {
    sandbox.stub(aws, "createServer").callsFake((app: any, cb: any) => {
      cb();

      return {server: "serve"} as any;
    });
    sandbox.stub(aws, "proxy").returns(Promise.resolve() as any);
  });
  afterEach(() => sandbox.restore());
  it("should create aws server", async () => {
    PlatformAws.bootstrap(Server, {
      platform: PlatformExpress,
      logger: {level: "off"}
    });

    await PlatformAws.promise;

    expect(aws.createServer).to.have.been.calledWithExactly(PlatformAws.platform.app.callback(), Sinon.match.func, BYNARY_MIME_TYPES);

    const handler = PlatformAws.callback();

    await handler({event: "event"}, {context: "context"});

    expect(aws.proxy).to.have.been.calledWithExactly({server: "serve"}, {event: "event"}, {context: "context"}, "PROMISE");
  });
});
