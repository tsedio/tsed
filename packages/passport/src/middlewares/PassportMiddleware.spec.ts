import {PlatformRequest, PlatformResponse, PlatformTest} from "@tsed/common";
import {Unauthorized} from "@tsed/exceptions";
import {PassportException} from "@tsed/passport";
import {expect} from "chai";
import Passport from "passport";
import Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../test/helper";
import {stub} from "../../../../test/helper/tools";
import {PassportMiddleware} from "./PassportMiddleware";

const sandbox = Sinon.createSandbox();

function createContextFixture(options = {}) {
  const request: any = new FakeRequest(options);
  const response: any = new FakeResponse();
  return PlatformTest.createRequestContext({
    request: new PlatformRequest(request),
    response: new PlatformResponse(response)
  });
}

describe("PassportMiddleware", () => {
  beforeEach(() => {
    PlatformTest.create();
    sandbox.stub(Passport, "authenticate").callsFake(() => (req: any, res: any, next: any) => {
      return next();
    });
  });
  afterEach(() => {
    PlatformTest.reset();
    sandbox.restore();
  });
  it("should call passport with local", async () => {
    // GIVEN
    const middleware = new PassportMiddleware();
    const context = createContextFixture();

    middleware.protocolsService = {
      getProtocolsNames: sandbox.stub().returns(["local"])
    } as any;

    context.endpoint = {
      store: {
        get: sandbox.stub().returns({
          options: {},
          protocol: "local",
          method: "authenticate"
        })
      }
    } as any;

    // WHEN
    await middleware.use(context);

    // THEN
    expect(Passport.authenticate).to.have.been.calledWithExactly("local", {failWithError: true});
  });
  it("should skip auth when user is authenticated", async () => {
    // GIVEN
    const middleware = new PassportMiddleware();
    const context = createContextFixture();

    middleware.protocolsService = {
      getProtocolsNames: sandbox.stub().returns(["local"])
    } as any;

    context.getRequest().user = {};
    context.getRequest().isAuthenticated = () => {
      return true;
    };

    context.endpoint = {
      store: {
        get: sandbox.stub().returns({
          options: {},
          protocol: "local",
          method: "authenticate"
        })
      }
    } as any;

    // WHEN
    await middleware.use(context);

    // THEN
    return expect(Passport.authenticate).to.not.have.been.called;
  });

  it("should call passport with defaults protocols", async () => {
    // GIVEN
    const middleware = new PassportMiddleware();
    middleware.protocolsService = {
      getProtocolsNames: sandbox.stub().returns(["local", "basic"])
    } as any;

    const context = createContextFixture();

    context.endpoint = {
      store: {
        get: sandbox.stub().returns({
          options: {},
          protocol: "*",
          method: "authenticate"
        })
      }
    } as any;

    // WHEN
    await middleware.use(context);

    // THEN
    expect(Passport.authenticate).to.have.been.calledWithExactly(["local", "basic"], {failWithError: true});
  });
  it("should call passport with :protocol", async () => {
    // GIVEN
    const middleware = new PassportMiddleware();
    middleware.protocolsService = {
      getProtocolsNames: sandbox.stub().returns(["local", "basic"])
    } as any;

    const context = createContextFixture({
      url: "/",
      originalUrl: "/rest",
      query: {
        protocol: "basic"
      }
    });

    context.endpoint = {
      store: {
        get: sandbox.stub().returns({
          options: {},
          protocol: ":protocol",
          method: "authenticate"
        })
      }
    } as any;

    // WHEN
    await middleware.use(context);

    // THEN
    expect(context.getRequest().url).to.eq(context.getRequest().originalUrl);
    expect(Passport.authenticate).to.have.been.calledWithExactly("basic", {failWithError: true});
  });
  it("should throw errors", async () => {
    // GIVEN
    const middleware = new PassportMiddleware();
    middleware.protocolsService = {
      getProtocolsNames: sandbox.stub().returns(["local", "basic"])
    } as any;

    const context = createContextFixture();
    context.endpoint = {
      store: {
        get: sandbox.stub().returns({
          options: {},
          protocol: ":protocol",
          method: "authenticate"
        })
      }
    } as any;

    // WHEN
    let actualError;
    try {
      await middleware.use(context);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError).to.be.instanceOf(Unauthorized);
  });
  it("should throw errors from passport (AuthenticationError)", async () => {
    // GIVEN
    const middleware = new PassportMiddleware();
    middleware.protocolsService = {
      getProtocolsNames: sandbox.stub().returns(["local", "basic"])
    } as any;

    stub(Passport.authenticate).callsFake(() => (req: any, res: any, next: any) => {
      const error: any = {message: "message"};
      error.name = "AuthenticationError";
      error.status = 400;

      return next(error);
    });

    const context = createContextFixture();

    context.endpoint = {
      store: {
        get: sandbox.stub().returns({
          options: {},
          protocol: "*",
          method: "authenticate"
        })
      }
    } as any;

    // WHEN
    let actualError;
    try {
      await middleware.use(context);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError).to.be.instanceOf(PassportException);
    expect(actualError.message).to.eq("message");
    expect(actualError.status).to.eq(400);
  });
  it("should throw errors from passport (AnyError)", async () => {
    // GIVEN
    const middleware = new PassportMiddleware();
    middleware.protocolsService = {
      getProtocolsNames: sandbox.stub().returns(["local", "basic"])
    } as any;

    stub(Passport.authenticate).callsFake(() => (req: any, res: any, next: any) => {
      const error: any = {message: "message"};
      error.name = "Any";

      return next(error);
    });

    const context = createContextFixture();

    context.endpoint = {
      store: {
        get: sandbox.stub().returns({
          options: {},
          protocol: "*",
          method: "authenticate"
        })
      }
    } as any;

    // WHEN
    let actualError;
    try {
      await middleware.use(context);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError).to.be.instanceOf(PassportException);
    expect(actualError.message).to.eq("message");
    expect(actualError.status).to.eq(500);
  });
  it("should throw errors from passport (Error)", async () => {
    // GIVEN
    const middleware = new PassportMiddleware();
    middleware.protocolsService = {
      getProtocolsNames: sandbox.stub().returns(["local", "basic"])
    } as any;

    stub(Passport.authenticate).callsFake(() => (req: any, res: any, next: any) => {
      const error: any = new Error("message");

      return next(error);
    });

    const context = createContextFixture();

    context.endpoint = {
      store: {
        get: sandbox.stub().returns({
          options: {},
          protocol: "*",
          method: "authenticate"
        })
      }
    } as any;

    // WHEN
    let actualError;
    try {
      await middleware.use(context);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError).to.be.instanceOf(Error);
    expect(actualError.message).to.eq("message");
  });
});
