import {HandlerMetadata, HandlerType, PlatformTest} from "@tsed/common";
import {PlatformKoaHandler} from "@tsed/platform-koa";
import {invokePlatformHandler} from "../../../../../test/helper/invokePlatformHandler";

describe("PlatformKoaHandler", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  describe("createHandler", () => {
    describe("$CTX", () => {
      it("should return a native handler with 3 params", async () => {
        // GIVEN
        const platformHandler = await invokePlatformHandler(PlatformKoaHandler);

        class Test {
          use() {}
        }

        PlatformTest.invoke(Test);

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: (ctx: any) => {},
          type: HandlerType.CTX_FN
        });

        // WHEN
        const handler = platformHandler.createHandler(handlerMetadata);

        // THEN
        expect(handler).not.toEqual(handlerMetadata.handler);
        expect(handler.length).toEqual(2);
      });
      it("should catch error from handler", async () => {
        // GIVEN
        const platformHandler = await invokePlatformHandler(PlatformKoaHandler);

        class Test {
          use() {}
        }

        const error = new Error("test");

        PlatformTest.invoke(Test);

        const $ctx = PlatformTest.createRequestContext();
        const next = jest.fn();
        const ctx = {
          request: $ctx.getRequest(),
          response: $ctx.getResponse()
        };
        $ctx.getRequest().ctx = ctx;
        $ctx.getApp().emit = jest.fn();

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: (ctx: any) => {
            throw error;
          },
          type: HandlerType.CTX_FN
        });

        // WHEN
        const handler = platformHandler.createHandler(handlerMetadata);

        // THEN
        expect(handler).not.toEqual(handlerMetadata.handler);
        expect(handler.length).toEqual(2);

        await handler(ctx, next);

        expect($ctx.getApp().emit).toBeCalledWith("error", error, ctx);
      });
    });
  });
});
