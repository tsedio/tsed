import {Unauthorized} from "@tsed/exceptions";
import {PlatformTest} from "@tsed/platform-http/testing";
import Passport from "passport";

import {PassportException} from "../errors/PassportException.js";
import {PassportMiddleware} from "./PassportMiddleware.js";

function createContextFixture(options = {}) {
  return PlatformTest.createRequestContext({
    event: {
      request: PlatformTest.createRequest(options)
    }
  });
}

describe("PassportMiddleware", () => {
  beforeEach(() => {
    PlatformTest.create();
    vi.spyOn(Passport, "authenticate").mockImplementation(() => (req: any, res: any, next: any) => {
      return next();
    });
    vi.spyOn(Passport, "authorize").mockImplementation(() => (req: any, res: any, next: any) => {
      return next();
    });
  });
  afterEach(() => {
    PlatformTest.reset();
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
  it("should skip auth when user is authenticated", async () => {
    // GIVEN
    const middleware = await PlatformTest.invoke<PassportMiddleware>(PassportMiddleware);
    const context = createContextFixture();

    vi.spyOn(middleware.protocolsService, "getProtocolsNames").mockReturnValue(["local"]);

    context.getRequest().user = {};
    context.getRequest().isAuthenticated = () => {
      return true;
    };

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
    return expect(Passport.authenticate).not.toHaveBeenCalled();
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
    let actualError;
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
    let actualError;
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
    let actualError;
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
    let actualError;
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
