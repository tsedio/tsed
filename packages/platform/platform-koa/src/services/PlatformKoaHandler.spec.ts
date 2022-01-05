import {HandlerMetadata, HandlerType, PlatformHandler, PlatformTest} from "@tsed/common";
import {PlatformKoa, PlatformKoaHandler} from "@tsed/platform-koa";
import {expect} from "chai";
import Sinon from "sinon";

const sandbox = Sinon.createSandbox();

describe("PlatformKoaHandler", () => {
  beforeEach(() =>
    PlatformTest.create({
      adapter: PlatformKoa
    })
  );
  afterEach(PlatformTest.reset);
  afterEach(() => {
    sandbox.restore();
  });

  describe("createHandler", () => {
    describe("$CTX", () => {
      it("should return a native handler with 2 params", async () => {
        // GIVEN
        const platformHandler = PlatformTest.get<PlatformHandler>(PlatformHandler);

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
        expect(handler).to.not.eq(handlerMetadata.handler);
        expect(handler.length).to.eq(2);
      });
      it("should catch error from handler", async () => {
        // GIVEN
        const platformHandler = PlatformTest.get<PlatformHandler>(PlatformHandler);

        class Test {
          use() {}
        }

        const error = new Error("test");

        PlatformTest.invoke(Test);

        const $ctx = PlatformTest.createRequestContext();
        const next = sandbox.stub();
        const ctx = {
          request: $ctx.getRequest(),
          response: $ctx.getResponse()
        };
        $ctx.getRequest().ctx = ctx;
        $ctx.getApp().emit = sandbox.stub();

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
        expect(handler).to.not.eq(handlerMetadata.handler);
        expect(handler.length).to.eq(2);

        await handler(ctx, next);

        expect($ctx.getApp().emit).to.have.been.calledWithExactly("error", error, ctx);
      });
    });
  });
});
