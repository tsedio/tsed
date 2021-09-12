import {Err, HandlerMetadata, HandlerType, ParamTypes, PlatformTest} from "@tsed/common";
import {PlatformExpressHandler} from "@tsed/platform-express";
import {expect} from "chai";
import Sinon from "sinon";
import {buildPlatformHandler, invokePlatformHandler} from "../../../../test/helper/buildPlatformHandler";
import {createFakePlatformContext} from "../../../../test/helper/createFakePlatformContext";

const sandbox = Sinon.createSandbox();

describe("PlatformExpressHandler", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  afterEach(() => {
    sandbox.restore();
  });

  describe("createHandler", () => {
    describe("ENDPOINT", () => {
      it("should return a native handler with 3 params", async () => {
        // GIVEN
        const platformHandler = await invokePlatformHandler<PlatformExpressHandler>(PlatformExpressHandler);

        class Test {
          get() {}
        }

        PlatformTest.invoke(Test);

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          type: HandlerType.ENDPOINT,
          propertyKey: "get"
        });

        // WHEN
        const handler = platformHandler.createHandler(handlerMetadata);

        // THEN
        expect(handler).to.not.eq(handlerMetadata.handler);
        expect(handler.length).to.eq(3);
      });
    });
    describe("MIDDLEWARE", () => {
      it("should return a native handler with 3 params", async () => {
        // GIVEN
        const platformHandler = await invokePlatformHandler(PlatformExpressHandler);

        class Test {
          use() {}
        }

        PlatformTest.invoke(Test);

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: Test,
          type: HandlerType.MIDDLEWARE,
          propertyKey: "use"
        });

        // WHEN
        const handler = platformHandler.createHandler(handlerMetadata);

        // THEN
        expect(handler).to.not.eq(handlerMetadata.handler);
        expect(handler.length).to.eq(3);
      });
      it("should return a native handler with 4 params", async () => {
        // GIVEN
        const platformHandler = await invokePlatformHandler(PlatformExpressHandler);

        class Test {
          use(@Err() err: unknown) {}
        }

        PlatformTest.invoke(Test);

        const metadata = new HandlerMetadata({
          token: Test,
          target: Test,
          type: HandlerType.MIDDLEWARE,
          propertyKey: "use"
        });

        // WHEN
        const handler = platformHandler.createHandler(metadata);

        // THEN
        expect(metadata.hasErrorParam).to.eq(true);
        expect(handler).to.not.eq(metadata.handler);
        expect(handler.length).to.eq(4);
      });
    });
    describe("$CTX", () => {
      it("should return a native handler with 3 params", async () => {
        // GIVEN
        const platformHandler = await invokePlatformHandler(PlatformExpressHandler);

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
        expect(handler.length).to.eq(3);
      });
      it("should catch error from handler", async () => {
        // GIVEN
        const platformHandler = await invokePlatformHandler(PlatformExpressHandler);

        class Test {
          use() {}
        }

        const error = new Error("test");
        PlatformTest.invoke(Test);

        const $ctx = createFakePlatformContext(sandbox);

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
        expect(handler.length).to.eq(3);

        const next = sandbox.stub();

        await handler($ctx.getRequest(), $ctx.getResponse(), next);

        expect(next).to.have.been.calledWithExactly(error);
      });
    });
    describe("FUNCTION", () => {
      it("should return a native handler with 3 params", async () => {
        // GIVEN
        const platformHandler = await invokePlatformHandler(PlatformExpressHandler);

        class Test {
          use() {}
        }

        PlatformTest.invoke(Test);

        const handlerMetadata = new HandlerMetadata({
          token: Test,
          target: (req: any, res: any, next: any) => {},
          type: HandlerType.RAW_FN
        });

        // WHEN
        const handler = platformHandler.createHandler(handlerMetadata);

        // THEN
        expect(handler).to.eq(handlerMetadata.handler);
      });
    });
  });
});
