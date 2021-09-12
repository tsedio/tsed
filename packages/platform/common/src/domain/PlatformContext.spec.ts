import {PlatformApplication, PlatformRequest, PlatformResponse, PlatformTest} from "@tsed/common";
import {nameOf} from "@tsed/core";
import {expect} from "chai";
import sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../test/helper";
import {PlatformContext} from "./PlatformContext";

describe("PlatformContext", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a new Context and skip log", () => {
    const req: any = new FakeRequest();
    const res: any = new FakeResponse();
    // @ts-ignore
    const context = new PlatformContext({
      id: "id",
      logger: {
        info: sinon.stub()
      },
      maxStackSize: 0,
      injector: PlatformTest.injector,
      response: new PlatformResponse(res),
      request: new PlatformRequest(req),
      url: "/admin",
      ignoreUrlPatterns: ["/admin", /\/admin2/]
    });

    expect(context.id).to.eq("id");
    expect(context.dateStart).to.be.instanceof(Date);
    expect(context.container).to.be.instanceof(Map);
    expect(context.env).to.be.equal("test");
    expect(context.getRequest()).to.be.instanceof(FakeRequest);
    expect(context.getResponse()).to.be.instanceof(FakeResponse);
    expect(context.getReq()).to.be.instanceof(FakeRequest);
    expect(context.getRes()).to.be.instanceof(FakeResponse);
    expect(context.app).to.be.instanceof(PlatformApplication);
    expect(nameOf(context.getApp())).to.eq("FakeRawDriver");

    context.logger.info("test");

    // @ts-ignore
    return expect(context.logger.logger.info).to.not.have.been.called;
  });
  it("should create a new Context and log event", () => {
    const req: any = new FakeRequest();
    const res: any = new FakeResponse();
    // @ts-ignore
    const context = new PlatformContext({
      id: "id",
      logger: {
        info: sinon.stub()
      },
      injector: PlatformTest.injector,
      response: new PlatformResponse(res),
      request: new PlatformRequest(req),
      maxStackSize: 0,
      url: "/",
      ignoreUrlPatterns: ["/admin"]
    });

    expect(context.id).to.eq("id");
    expect(context.dateStart).to.be.instanceof(Date);
    expect(context.container).to.be.instanceof(Map);
    expect(context.env).to.be.equal("test");
    expect(context.getRequest()).to.be.instanceof(FakeRequest);
    expect(context.getResponse()).to.be.instanceof(FakeResponse);
    expect(context.getReq()).to.be.instanceof(FakeRequest);
    expect(context.getRes()).to.be.instanceof(FakeResponse);
    expect(context.app).to.be.instanceof(PlatformApplication);
    expect(nameOf(context.getApp())).to.eq("FakeRawDriver");

    context.logger.info("test");

    // @ts-ignore
    return expect(context.logger.logger.info).to.have.been.called;
  });
});
