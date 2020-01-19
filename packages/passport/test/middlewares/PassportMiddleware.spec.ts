import {expect} from "chai";
import * as Passport from "passport";
import * as Sinon from "sinon";
import {Unauthorized} from "ts-httpexceptions";
import {PassportMiddleware} from "../../src/middlewares/PassportMiddleware";

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
    Passport.authenticate.should.have.been.calledWithExactly("local", {});
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
    Passport.authenticate.should.have.been.calledWithExactly(["local", "basic"], {});
  });
  it("should call passport with :protocol", () => {
    // GIVEN
    const middleware = new PassportMiddleware();
    middleware.protocolsService = {
      getProtocolsNames: sandbox.stub().returns(["local", "basic"])
    } as any;

    const request: any = {
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
    Passport.authenticate.should.have.been.calledWithExactly("basic", {});
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
