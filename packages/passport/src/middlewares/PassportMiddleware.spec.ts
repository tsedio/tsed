import {Unauthorized} from "@tsed/exceptions";
import {expect} from "chai";
import Passport from "passport";
import Sinon from "sinon";
import {PassportMiddleware} from "./PassportMiddleware";

const sandbox = Sinon.createSandbox();

describe("PassportMiddleware", () => {
  beforeEach(() => {
    sandbox.stub(Passport, "authenticate");
  });
  afterEach(() => {
    sandbox.restore();
  });
  it("should call passport with local", () => {
    // GIVEN
    const middleware = new PassportMiddleware();
    middleware.protocolsService = {
      getProtocolsNames: sandbox.stub().returns(["local"])
    } as any;

    const request: any = {};
    const endpoint: any = {
      store: {
        get: sandbox.stub().returns({
          options: {},
          protocol: "local",
          method: "authenticate"
        })
      }
    };

    // WHEN
    middleware.use(request, endpoint);

    // THEN
    expect(Passport.authenticate).to.have.been.calledWithExactly("local", {});
  });
  it("should skip auth when user is authenticated", () => {
    // GIVEN
    const middleware = new PassportMiddleware();
    middleware.protocolsService = {
      getProtocolsNames: sandbox.stub().returns(["local"])
    } as any;

    const request: any = {
      user: {},
      isAuthenticated() {
        return true;
      }
    };
    const endpoint: any = {
      store: {
        get: sandbox.stub().returns({
          options: {},
          protocol: "local",
          method: "authenticate"
        })
      }
    };

    // WHEN
    middleware.use(request, endpoint);

    // THEN
    return expect(Passport.authenticate).to.not.have.been.called;
  });

  it("should call passport with defaults protocols", () => {
    // GIVEN
    const middleware = new PassportMiddleware();
    middleware.protocolsService = {
      getProtocolsNames: sandbox.stub().returns(["local", "basic"])
    } as any;

    const request: any = {};
    const endpoint: any = {
      store: {
        get: sandbox.stub().returns({
          options: {},
          protocol: "*",
          method: "authenticate"
        })
      }
    };

    // WHEN
    middleware.use(request, endpoint);

    // THEN
    expect(Passport.authenticate).to.have.been.calledWithExactly(["local", "basic"], {});
  });
  it("should call passport with :protocol", () => {
    // GIVEN
    const middleware = new PassportMiddleware();
    middleware.protocolsService = {
      getProtocolsNames: sandbox.stub().returns(["local", "basic"])
    } as any;

    const request: any = {
      url: "/",
      originalUrl: "/rest",
      query: {
        protocol: "basic"
      }
    };
    const endpoint: any = {
      store: {
        get: sandbox.stub().returns({
          options: {},
          protocol: ":protocol",
          method: "authenticate"
        })
      }
    };

    // WHEN
    middleware.use(request, endpoint);

    // THEN
    expect(request.url).to.eq(request.originalUrl);
    expect(Passport.authenticate).to.have.been.calledWithExactly("basic", {});
  });
  it("should throw errors", () => {
    // GIVEN
    const middleware = new PassportMiddleware();
    middleware.protocolsService = {
      getProtocolsNames: sandbox.stub().returns(["local", "basic"])
    } as any;

    const request: any = {};
    const endpoint: any = {
      store: {
        get: sandbox.stub().returns({
          options: {},
          protocol: ":protocol",
          method: "authenticate"
        })
      }
    };

    // WHEN
    let actualError;
    try {
      middleware.use(request, endpoint);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError).to.be.instanceOf(Unauthorized);
  });
});
