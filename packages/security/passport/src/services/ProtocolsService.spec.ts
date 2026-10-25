import {Protocol, ProtocolsService} from "../index.js";
import Passport from "passport";
import {PassportMessage} from "../errors/PassportMessage.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Req} from "@tsed/platform-http";
import {runInContext} from "@tsed/di";

// tslint:disable-next-line:variable-name
const Strategy = vi.fn();

describe("ProtocolsService", () => {
  @Protocol({
    name: "local",
    useStrategy: Strategy as any,
    settings: {
      prop1: "prop1",
      prop2: "prop2"
    }
  })
  class LocalProtocol {
    $beforeInstall(settings: any) {
      return Promise.resolve(settings);
    }

    $onInstall() {}

    $onVerify(@Req() req: Req) {
      return {id: 0};
    }
  }

  beforeEach(() =>
    PlatformTest.create({
      passport: {
        protocols: {
          local: {
            settings: {
              prop2: "prop2-server",
              prop3: "prop3"
            }
          }
        }
      }
    })
  );
  afterEach(PlatformTest.reset);

  beforeEach(() => {
    vi.spyOn(LocalProtocol.prototype, "$onInstall");
    vi.spyOn(LocalProtocol.prototype, "$onVerify");
    vi.spyOn(LocalProtocol.prototype, "$beforeInstall");
    vi.spyOn(Passport, "use").mockReturnValue(undefined as any);
    Strategy.mockReset();
  });

  it("should create a protocol", async () => {
    const protocolService = PlatformTest.get<ProtocolsService>(ProtocolsService);
    // GIVEN
    const provider = PlatformTest.injector.getProvider(LocalProtocol)!;

    // WHEN
    const result = await protocolService.invoke(provider);

    // THEN
    expect(result).toBeInstanceOf(LocalProtocol);
    expect(result.$onInstall).toHaveBeenCalledWith(protocolService.strategies.get("local"));
    expect(result.$beforeInstall).toHaveBeenCalledWith({
      passReqToCallback: true,
      prop1: "prop1",
      prop2: "prop2-server",
      prop3: "prop3"
    });
    expect(Passport.use).toHaveBeenCalledWith("local", protocolService.strategies.get("local"));
    expect(Strategy).toHaveBeenCalledWith(
      {
        passReqToCallback: true,
        prop1: "prop1",
        prop2: "prop2-server",
        prop3: "prop3"
      },
      expect.any(Function)
    );
    expect(protocolService.getProtocolsNames().includes("local")).toEqual(true);
    expect(protocolService.isLoginOnly("local")).toEqual(false);
  });

  it("should register a login-only protocol", async () => {
    @Protocol({name: "login-only", useStrategy: Strategy as any, settings: {}, loginOnly: true})
    class LoginOnlyProtocol {
      $onVerify() {
        return {id: 0};
      }
    }

    const protocolService = PlatformTest.get<ProtocolsService>(ProtocolsService);

    await protocolService.invoke(PlatformTest.injector.getProvider(LoginOnlyProtocol)!);

    expect(protocolService.isLoginOnly("login-only")).toEqual(true);
  });

  describe("serializeSessionProtocol()", () => {
    // Simulates Passport.js: the strategy succeeds, then req.logIn() serializes the user.
    function mockLogin(protocolService: ProtocolsService, method: "authenticate" | "authorize") {
      vi.spyOn(Passport, method).mockImplementation(() => (req: any, res: any, next: any) => {
        if (method === "authorize") {
          return next();
        }

        protocolService.serializeSessionProtocol(req, {id: 0}, (err: any) => {
          req.session.passport = {...req.session.passport, user: "id"};
          next(err === "pass" ? undefined : err);
        });
      });
    }

    function createContext() {
      const $ctx = PlatformTest.createRequestContext();
      $ctx.getRequest().session = {};
      $ctx.getRequest().$ctx = $ctx;

      return $ctx;
    }

    it("should record the protocol that established the session and pass to the next serializer", async () => {
      const protocolService = PlatformTest.get<ProtocolsService>(ProtocolsService);
      const $ctx = createContext();
      mockLogin(protocolService, "authenticate");

      await protocolService.authenticate("local", {}, $ctx);

      expect($ctx.getRequest().session.passport).toEqual({user: "id", protocol: "local"});
    });

    it("should record the protocol whose verify callback accepted the request", async () => {
      const protocolService = PlatformTest.get<ProtocolsService>(ProtocolsService);
      const $ctx = createContext();
      mockLogin(protocolService, "authenticate");
      (LocalProtocol.prototype.$onVerify as any).mockReturnValue({id: 0});

      await protocolService.invoke(PlatformTest.injector.getProvider(LocalProtocol)!);
      await new Promise((resolve) => {
        const verify = Strategy.mock.calls[0][1];

        return runInContext($ctx, () => verify($ctx.getRequest(), "test", resolve));
      });

      await protocolService.authenticate(["basic", "local"], {}, $ctx);

      expect($ctx.getRequest().session.passport.protocol).toEqual("local");
    });

    it("should not record a protocol for a login made outside @Authenticate()", () => {
      const protocolService = PlatformTest.get<ProtocolsService>(ProtocolsService);
      const $ctx = createContext();
      const done = vi.fn();

      protocolService.serializeSessionProtocol($ctx.getRequest(), {id: 0}, done);

      expect(done).toHaveBeenCalledWith("pass");
      expect($ctx.getRequest().session.passport).toBeUndefined();
    });

    it("should not record the protocol on authorize", async () => {
      const protocolService = PlatformTest.get<ProtocolsService>(ProtocolsService);
      const $ctx = createContext();
      $ctx.getRequest().session.passport = {user: "id", protocol: "local"};
      mockLogin(protocolService, "authorize");

      await protocolService.authorize("basic", {}, $ctx);

      expect($ctx.getRequest().session.passport.protocol).toEqual("local");
    });
  });

  it("should call metadata", async () => {
    const protocolService = PlatformTest.get<ProtocolsService>(ProtocolsService);
    // GIVEN
    (LocalProtocol.prototype.$onVerify as any).mockReturnValue({id: 0});
    const provider = PlatformTest.injector.getProvider(LocalProtocol)!;
    const $ctx = PlatformTest.createRequestContext();

    // WHEN
    const protocol = await protocolService.invoke(provider);

    const resultDone: any = await new Promise((resolve) => {
      const verify = Strategy.mock.calls[0][1];

      return runInContext($ctx, () => verify($ctx.getRequest(), "test", (...args: any[]) => resolve(args)));
    });

    // THEN
    expect(resultDone).toEqual([null, {id: 0}]);
    expect(protocol.$onVerify).toHaveBeenCalledWith($ctx.getRequest(), $ctx);
  });

  it("should call metadata and catch error", async () => {
    const protocolService = PlatformTest.get<ProtocolsService>(ProtocolsService);
    // GIVEN
    const error = new Error("message");
    (LocalProtocol.prototype.$onVerify as any).mockRejectedValue(error);

    const provider = PlatformTest.injector.getProvider(LocalProtocol)!;
    const $ctx = PlatformTest.createRequestContext();

    // WHEN
    const result = await protocolService.invoke(provider);
    const resultDone: any = await new Promise((resolve) => {
      const verify = Strategy.mock.calls[0][1];

      return runInContext($ctx, () => verify($ctx.getRequest(), "test", (...args: any[]) => resolve(args)));
    });

    // THEN
    expect(result.$onVerify).toHaveBeenCalledWith($ctx.getRequest(), $ctx);
    expect(resultDone).toEqual([error, false, {message: "message"}]);
  });

  it("should call metadata and catch PassportMessage", async () => {
    const protocolService = PlatformTest.get<ProtocolsService>(ProtocolsService);
    // GIVEN
    const error = new PassportMessage("message", {type: "allow"});
    (LocalProtocol.prototype.$onVerify as any).mockRejectedValue(error);

    const provider = PlatformTest.injector.getProvider(LocalProtocol)!;
    const $ctx = PlatformTest.createRequestContext();

    // WHEN
    const result = await protocolService.invoke(provider);
    const resultDone: any = await new Promise((resolve) => {
      const verify = Strategy.mock.calls[0][1];

      return runInContext($ctx, () => verify($ctx.getRequest(), "test", (...args: any[]) => resolve(args)));
    });

    // THEN
    expect(result.$onVerify).toHaveBeenCalledWith($ctx.getRequest(), $ctx);
    expect(resultDone).toEqual([null, false, {message: "message", type: "allow"}]);
  });

  it("should call metadata and catch missing $ctx", async () => {
    const protocolService = PlatformTest.get<ProtocolsService>(ProtocolsService);
    // GIVEN
    const provider = PlatformTest.injector.getProvider(LocalProtocol)!;

    // WHEN
    await protocolService.invoke(provider);
    const resultDone: any = await new Promise((resolve) => {
      Strategy.mock.calls[0][1]({}, "test", (...args: any[]) => resolve(args));
    });

    // THEN
    expect(resultDone).toEqual([new Error("Headers already sent"), false, {message: "Headers already sent"}]);
  });
});
