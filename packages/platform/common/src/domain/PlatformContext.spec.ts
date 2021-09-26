import {PlatformApplication, PlatformTest} from "@tsed/common";
import {nameOf} from "@tsed/core";
import {expect} from "chai";
import sinon from "sinon";
import {PlatformContext} from "./PlatformContext";

describe("PlatformContext", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a new Context and skip log", () => {
    // @ts-ignore
    const context = new PlatformContext({
      event: {
        response: PlatformTest.createResponse(),
        request: PlatformTest.createRequest({
          url: "/admin"
        })
      },
      id: "id",
      logger: {
        info: sinon.stub()
      },
      maxStackSize: 0,
      injector: PlatformTest.injector,
      ignoreUrlPatterns: ["/admin", /\/admin2/]
    });

    expect(context.id).to.eq("id");
    expect(context.dateStart).to.be.instanceof(Date);
    expect(context.container).to.be.instanceof(Map);
    expect(context.env).to.be.equal("test");
    expect(context.getRequest()).to.eq(context.request.raw);
    expect(context.getResponse()).to.eq(context.response.raw);
    expect(context.getReq()).to.eq(context.request.raw);
    expect(context.getRes()).to.eq(context.response.raw);
    expect(context.app).to.be.instanceof(PlatformApplication);
    expect(nameOf(context.getApp())).to.eq("FakeRawDriver");

    context.logger.info("test");

    // @ts-ignore
    return expect(context.logger.logger.info).to.not.have.been.called;
  });
  it("should create a new Context and log event", () => {
    // @ts-ignore
    const context = new PlatformContext({
      id: "id",
      event: {
        response: PlatformTest.createResponse(),
        request: PlatformTest.createRequest({
          url: "/"
        })
      },
      logger: {
        info: sinon.stub()
      },
      injector: PlatformTest.injector,
      maxStackSize: 0,
      ignoreUrlPatterns: ["/admin"]
    });

    expect(context.id).to.eq("id");
    expect(context.dateStart).to.be.instanceof(Date);
    expect(context.container).to.be.instanceof(Map);
    expect(context.env).to.be.equal("test");
    expect(context.app).to.be.instanceof(PlatformApplication);
    expect(nameOf(context.getApp())).to.eq("FakeRawDriver");

    context.logger.info("test");

    // @ts-ignore
    return expect(context.logger.logger.info).to.have.been.called;
  });
});
