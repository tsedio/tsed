import "../domain/PlatformLogRequestSettings.js";
import {DITest, injector} from "@tsed/di";
import {PlatformLogRequestFactory} from "./PlatformLogRequestFactory.js";

describe("PlatformLogRequestFactory", () => {
  describe("when logger is enabled", () => {
    beforeEach(() =>
      DITest.create({
        logger: {}
      })
    );
    afterEach(() => DITest.reset());

    it("should create logger factory", async () => {
      const factory = await DITest.invoke<PlatformLogRequestFactory>(PlatformLogRequestFactory);

      expect(factory).toEqual({
        alterLog: expect.any(Function),
        onLogResponse: expect.any(Function)
      });

      const ctx: any = {
        request: {
          method: "GET"
        },
        logger: {
          alterLog: vi.fn(),
          info: vi.fn()
        }
      };

      vi.spyOn(factory!, "alterLog").mockReturnValue({});
      vi.spyOn(factory!, "onLogResponse").mockReturnValue(undefined);

      injector().providers.get(PlatformLogRequestFactory)?.hooks?.$onRequest(factory!, ctx);

      expect(ctx.logger.alterLog).toHaveBeenCalledWith(expect.any(Function));

      ctx.logger.alterLog.mock.calls[0][0]({test: "test"}, "info");

      expect(ctx.logStarted).toBe(true);
      expect(factory!.alterLog).toHaveBeenCalledWith(
        "info",
        {
          test: "test"
        },
        ctx
      );

      injector().providers.get(PlatformLogRequestFactory)?.hooks?.$onResponse(factory!, ctx);

      expect(factory!.onLogResponse).toHaveBeenCalledWith(ctx);
    });
  });
  describe("when logger is enabled with options", () => {
    beforeEach(() =>
      DITest.create({
        logger: {
          logRequest: true,
          alterLog: vi.fn().mockReturnValue({}),
          onLogResponse: vi.fn()
        }
      })
    );
    afterEach(() => DITest.reset());

    it("should create logger factory", async () => {
      const factory = await DITest.invoke<PlatformLogRequestFactory>(PlatformLogRequestFactory);

      expect(factory).toEqual({
        alterLog: expect.any(Function),
        onLogResponse: expect.any(Function)
      });

      const ctx: any = {
        request: {
          method: "GET"
        },
        logger: {
          alterLog: vi.fn(),
          info: vi.fn()
        }
      };

      injector().providers.get(PlatformLogRequestFactory)?.hooks?.$onRequest(factory!, ctx);

      expect(ctx.logger.alterLog).toHaveBeenCalledWith(expect.any(Function));

      ctx.logger.alterLog.mock.calls[0][0]({test: "test"}, "info");

      expect(ctx.logStarted).toBe(true);
      expect(factory!.alterLog).toHaveBeenCalledWith(
        "info",
        {
          test: "test"
        },
        ctx
      );

      injector().providers.get(PlatformLogRequestFactory)?.hooks?.$onResponse(factory!, ctx);

      expect(factory!.onLogResponse).toHaveBeenCalledWith(ctx);
    });
  });
  describe("when logger is disabled", () => {
    beforeEach(() =>
      DITest.create({
        logger: {
          logRequest: false
        }
      })
    );
    afterEach(() => DITest.reset());

    it("should create logger factory", async () => {
      const factory = await DITest.invoke<PlatformLogRequestFactory>(PlatformLogRequestFactory);

      expect(factory).toEqual(null);

      const ctx: any = {
        request: {
          method: "GET"
        },
        logger: {
          alterLog: vi.fn(),
          info: vi.fn()
        }
      };

      injector().providers.get(PlatformLogRequestFactory)?.hooks?.$onRequest(factory!, ctx);

      expect(ctx.logger.alterLog).not.toHaveBeenCalled();

      injector().providers.get(PlatformLogRequestFactory)?.hooks?.$onResponse(factory!, ctx);
    });
  });
});
