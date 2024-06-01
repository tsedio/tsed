import {PlatformTest, Req} from "@tsed/common";
import Passport from "passport";
import {PassportMessage} from "../errors/PassportMessage.js";
import {Protocol, ProtocolsService} from "../index.js";

// tslint:disable-next-line:variable-name
const Strategy = jest.fn();

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
    jest.spyOn(LocalProtocol.prototype, "$onInstall");
    jest.spyOn(LocalProtocol.prototype, "$onVerify");
    jest.spyOn(LocalProtocol.prototype, "$beforeInstall");
    jest.spyOn(Passport, "use").mockReturnValue(undefined as any);
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

      return $ctx.runInContext(() => verify($ctx.getRequest(), "test", (...args: any[]) => resolve(args)));
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

      return $ctx.runInContext(() => verify($ctx.getRequest(), "test", (...args: any[]) => resolve(args)));
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

      return $ctx.runInContext(() => verify($ctx.getRequest(), "test", (...args: any[]) => resolve(args)));
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
