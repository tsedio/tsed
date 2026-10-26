import Passport from "passport";
import {PassportException} from "../errors/PassportException.js";
import {PassportMiddleware} from "./PassportMiddleware.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Unauthorized} from "@tsed/exceptions";

function createContextFixture(options = {}) {
  return PlatformTest.createRequestContext({
    event: {
      request: PlatformTest.createRequest(options)
    }
  });
}

describe("PassportMiddleware", () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    await PlatformTest.create();
    vi.spyOn(Passport, "authenticate").mockImplementation(() => (req: any, res: any, next: any) => {
      return next();
    });
    vi.spyOn(Passport, "authorize").mockImplementation(() => (req: any, res: any, next: any) => {
      return next();
    });
  });
  afterEach(async () => {
    await PlatformTest.reset();
    vi.restoreAllMocks();
  });
  it("should call passport with local", async () => {
    // GIVEN
    const middleware = await PlatformTest.invoke<PassportMiddleware>(PassportMiddleware);
    const context = createContextFixture();

    vi.spyOn(middleware.protocolsService, "getProtocolsNames").mockReturnValue(["local"]);

    context.endpoint = {
      store: {
        get: vi.fn().mockReturnValue({
          options: {},
          protocol: "local",
          method: "authenticate"
        })
      }
    } as any;

    // WHEN
    await middleware.use(context);

    // THEN
    expect(Passport.authenticate).toHaveBeenCalledWith("local", {failWithError: true});
  });
  describe("session and protocols", () => {
    // Registered protocols: local, basic and jwt.
    async function run({
      protocol,
      method = "authorize",
      authenticated = false,
      sessionProtocol,
      loginOnly = []
    }: {
      protocol: string | string[];
      method?: string;
      authenticated?: boolean;
      sessionProtocol?: string;
      loginOnly?: string[];
    }) {
      const middleware = await PlatformTest.invoke<PassportMiddleware>(PassportMiddleware);
      const context = createContextFixture();
      const request = context.getRequest();

      vi.spyOn(middleware.protocolsService, "getProtocolsNames").mockReturnValue(["local", "basic", "jwt"]);
      vi.spyOn(middleware.protocolsService, "isLoginOnly").mockImplementation((name) => loginOnly.includes(name));

      if (authenticated) {
        request.user = {};
        request.isAuthenticated = () => true;
        request.session = {passport: {user: "id", protocol: sessionProtocol}};
      }

      context.endpoint = {
        store: {
          get: vi.fn().mockReturnValue({options: {}, protocol, method})
        }
      } as any;

      return middleware.use(context);
    }

    describe("with an authenticated session", () => {
      it("should skip auth for any protocol (*)", async () => {
        await run({protocol: "*", authenticated: true, sessionProtocol: "local"});

        expect(Passport.authorize).not.toHaveBeenCalled();
      });
      it("should skip auth for the session protocol", async () => {
        await run({protocol: ["session", "jwt"], authenticated: true});

        expect(Passport.authorize).not.toHaveBeenCalled();
      });
      it("should skip auth when the session was established by the requested protocol", async () => {
        await run({protocol: "local", method: "authenticate", authenticated: true, sessionProtocol: "local"});

        expect(Passport.authenticate).not.toHaveBeenCalled();
      });
      it("should run the requested strategy when the session was established by another protocol", async () => {
        await run({protocol: "jwt", authenticated: true, sessionProtocol: "local"});

        expect(Passport.authorize).toHaveBeenCalledWith("jwt", {failWithError: true});
      });
      it("should run the requested strategy when the session protocol is unknown", async () => {
        await run({protocol: "basic", authenticated: true});

        expect(Passport.authorize).toHaveBeenCalledWith("basic", {failWithError: true});
      });
    });

    describe("without session", () => {
      it("should reject the session protocol without calling passport", async () => {
        await expect(run({protocol: "session"})).rejects.toBeInstanceOf(Unauthorized);

        expect(Passport.authorize).not.toHaveBeenCalled();
      });
      it("should fall back to the other protocols when the session protocol is not satisfied", async () => {
        await run({protocol: ["session", "jwt"]});

        expect(Passport.authorize).toHaveBeenCalledWith("jwt", {failWithError: true});
      });
      it("should not run a login-only protocol on @Authorize()", async () => {
        await run({protocol: "*", loginOnly: ["local"]});

        expect(Passport.authorize).toHaveBeenCalledWith(["basic", "jwt"], {failWithError: true});
      });
      it("should reject @Authorize() when only login-only protocols are requested", async () => {
        await expect(run({protocol: "local", loginOnly: ["local"]})).rejects.toBeInstanceOf(Unauthorized);

        expect(Passport.authorize).not.toHaveBeenCalled();
      });
      it("should run a login-only protocol on @Authenticate()", async () => {
        await run({protocol: "local", method: "authenticate", loginOnly: ["local"]});

        expect(Passport.authenticate).toHaveBeenCalledWith("local", {failWithError: true});
      });
    });
  });

  it("should call passport with defaults protocols", async () => {
    // GIVEN
    const middleware = await PlatformTest.invoke<PassportMiddleware>(PassportMiddleware);
    vi.spyOn(middleware.protocolsService, "getProtocolsNames").mockReturnValue(["local", "basic"]);

    const context = createContextFixture();

    context.endpoint = {
      store: {
        get: vi.fn().mockReturnValue({
          options: {},
          protocol: "*",
          method: "authenticate"
        })
      }
    } as any;

    // WHEN
    await middleware.use(context);

    // THEN
    expect(Passport.authenticate).toHaveBeenCalledWith(["local", "basic"], {failWithError: true});
  });
  it("should call passport with :protocol", async () => {
    // GIVEN
    const middleware = await PlatformTest.invoke<PassportMiddleware>(PassportMiddleware);
    vi.spyOn(middleware.protocolsService, "getProtocolsNames").mockReturnValue(["local", "basic"]);

    const context = createContextFixture({
      url: "/",
      originalUrl: "/rest",
      query: {
        protocol: "basic"
      }
    });

    context.endpoint = {
      store: {
        get: vi.fn().mockReturnValue({
          options: {},
          protocol: ":protocol",
          method: "authenticate"
        })
      }
    } as any;

    // WHEN
    await middleware.use(context);

    // THEN
    expect(context.getRequest().url).toBe(context.getRequest().originalUrl);
    expect(Passport.authenticate).toHaveBeenCalledWith("basic", {failWithError: true});
  });
  it("should call passport with authorize", async () => {
    // GIVEN
    const middleware = await PlatformTest.invoke<PassportMiddleware>(PassportMiddleware);
    vi.spyOn(middleware.protocolsService, "getProtocolsNames").mockReturnValue(["local", "basic"]);

    const context = createContextFixture({
      url: "/",
      originalUrl: "/rest",
      query: {
        protocol: "basic"
      }
    });

    context.endpoint = {
      store: {
        get: vi.fn().mockReturnValue({
          options: {},
          protocol: ":protocol",
          method: "authorize"
        })
      }
    } as any;

    // WHEN
    await middleware.use(context);

    // THEN
    expect(context.getRequest().url).toBe(context.getRequest().originalUrl);
    expect(Passport.authorize).toHaveBeenCalledWith("basic", {failWithError: true});
  });
  it("should throw errors", async () => {
    // GIVEN
    const middleware = await PlatformTest.invoke<PassportMiddleware>(PassportMiddleware);
    vi.spyOn(middleware.protocolsService, "getProtocolsNames").mockReturnValue(["local", "basic"]);

    const context = createContextFixture();
    context.endpoint = {
      store: {
        get: vi.fn().mockReturnValue({
          options: {},
          protocol: ":protocol",
          method: "authenticate"
        })
      }
    } as any;

    // WHEN
    let actualError: any;
    try {
      await middleware.use(context);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError).toBeInstanceOf(Unauthorized);
  });
  it("should throw errors from passport (AuthenticationError)", async () => {
    // GIVEN
    const middleware = await PlatformTest.invoke<PassportMiddleware>(PassportMiddleware);
    vi.spyOn(middleware.protocolsService, "getProtocolsNames").mockReturnValue(["local", "basic"]);

    (Passport.authenticate as any).mockImplementation(() => (req: any, res: any, next: any) => {
      const error: any = {message: "message"};
      error.name = "AuthenticationError";
      error.status = 400;

      return next(error);
    });

    const context = createContextFixture();

    context.endpoint = {
      store: {
        get: vi.fn().mockReturnValue({
          options: {},
          protocol: "*",
          method: "authenticate"
        })
      }
    } as any;

    // WHEN
    let actualError: any;
    try {
      await middleware.use(context);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError).toBeInstanceOf(PassportException);
    expect(actualError.message).toBe("message");
    expect(actualError.status).toBe(400);
  });
  it("should throw errors from passport (AnyError)", async () => {
    // GIVEN
    const middleware = await PlatformTest.invoke<PassportMiddleware>(PassportMiddleware);
    vi.spyOn(middleware.protocolsService, "getProtocolsNames").mockReturnValue(["local", "basic"]);

    (Passport.authenticate as any).mockImplementation(() => (req: any, res: any, next: any) => {
      const error: any = {message: "message"};
      error.name = "Any";

      return next(error);
    });

    const context = createContextFixture();

    context.endpoint = {
      store: {
        get: vi.fn().mockReturnValue({
          options: {},
          protocol: "*",
          method: "authenticate"
        })
      }
    } as any;

    // WHEN
    let actualError: any;
    try {
      await middleware.use(context);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError).toBeInstanceOf(PassportException);
    expect(actualError.message).toBe("message");
    expect(actualError.status).toBe(500);
  });
  it("should throw errors from passport (Error)", async () => {
    // GIVEN
    const middleware = await PlatformTest.invoke<PassportMiddleware>(PassportMiddleware);
    vi.spyOn(middleware.protocolsService, "getProtocolsNames").mockReturnValue(["local", "basic"]);

    (Passport.authenticate as any).mockImplementation(() => (req: any, res: any, next: any) => {
      const error: any = new Error("message");

      return next(error);
    });

    const context = createContextFixture();

    context.endpoint = {
      store: {
        get: vi.fn().mockReturnValue({
          options: {},
          protocol: "*",
          method: "authenticate"
        })
      }
    } as any;

    // WHEN
    let actualError: any;
    try {
      await middleware.use(context);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError).toBeInstanceOf(Error);
    expect(actualError.message).toBe("message");
  });
});
