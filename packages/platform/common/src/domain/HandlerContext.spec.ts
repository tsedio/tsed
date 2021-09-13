import {HandlerMetadata, HandlerType, PlatformTest} from "@tsed/common";
import {AnyToPromiseStatus, isStream} from "@tsed/core";
import {expect} from "chai";
import {createReadStream} from "fs";
import {of} from "rxjs";
import Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {createFakePlatformContext} from "../../../../../test/helper/createFakePlatformContext";
import {HandlerContext} from "./HandlerContext";

const sandbox = Sinon.createSandbox();

class Test {
  getValue(body: any) {
    return body;
  }

  responseHeadersSent(res: any) {
    res.send("test");
  }

  catchError(body: any) {
    throw new Error(body);
  }

  empty() {
    return undefined;
  }

  async getValueWithPromise(body: any) {
    return body;
  }

  getObservable(body: any) {
    return of([body]);
  }

  getBuffer(body: any) {
    return Buffer.from(body);
  }

  getStream() {
    return createReadStream(__dirname + "/__mock__/response.txt");
  }

  getResponse() {
    return {
      data: "data",
      headers: {
        "Content-Type": "type"
      },
      status: 200,
      statusText: "OK"
    };
  }

  async returnMiddleware() {
    return (req: any, res: any, next: any) => {
      next();
    };
  }
}

async function getHandlerContext({token, propertyKey, args}: any = {}) {
  const injector = PlatformTest.injector;
  injector.addProvider(Test);

  injector.invoke(Test);

  const metadata = new HandlerMetadata({
    target: token,
    token,
    propertyKey,
    type: HandlerType.ENDPOINT
  });

  const $ctx = createFakePlatformContext(sandbox);

  const handlerContext: HandlerContext = new HandlerContext({
    $ctx,
    metadata,
    args
  });

  return {
    $ctx,
    handlerContext
  };
}

describe("HandlerContext", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  afterEach(() => sandbox.restore());

  it("should declare a new HandlerContext and return value", async () => {
    const {$ctx, handlerContext: h} = await getHandlerContext({
      token: Test,
      propertyKey: "getValue",
      args: ["value"]
    });

    // @ts-ignore
    Sinon.spy(h, "handle");

    expect(h.metadata).to.be.instanceof(HandlerMetadata);
    expect(h.request).to.be.instanceof(FakeRequest);
    expect(h.response).to.be.instanceof(FakeResponse);
    expect(h.args).to.deep.eq(["value"]);

    // WHEN
    const result = await h.callHandler();
    h.cancel();
    h.next();
    h.resolve();
    h.reject(new Error("error"));

    // THEN
    expect(result).to.deep.eq({
      data: "value",
      state: "RESOLVED",
      type: "DATA"
    });
    expect($ctx.data).to.eq("value");
    expect(h.isDone).to.eq(true);
    expect(h.status).to.eq(AnyToPromiseStatus.RESOLVED);
    expect(h.metadata).to.eq(undefined);
    expect(h.request).to.eq(undefined);
    expect(h.response).to.eq(undefined);
    expect(h.args).to.eq(undefined);
    // @ts-ignore
    expect(h.handle).to.have.been.calledWithExactly("value");
    expect(h.handle).to.have.been.callCount(1);
  });

  it("should call handler inside native middleware", async () => {
    const {$ctx, handlerContext: h} = await getHandlerContext({
      token: Test,
      propertyKey: "getValue",
      args: ["value"]
    });
    const next = Sinon.stub();

    // WHEN
    const middleware = async (req: any, res: any, next: any) => {
      try {
        await h.callHandler();

        return next();
      } catch (er) {
        return next(er);
      }
    };

    await middleware($ctx.getRequest(), $ctx.getResponse(), next);

    expect(next).to.have.been.calledWithExactly();
  });

  it("should declare a new HandlerContext and catch error", async () => {
    const {handlerContext} = await getHandlerContext({
      token: Test,
      propertyKey: "catchError",
      args: ["value"]
    });

    Sinon.spy(handlerContext, "handle");

    // WHEN
    let actualError: any;
    try {
      await handlerContext.callHandler();
    } catch (er) {
      actualError = er;
    }

    // THEN
    // @ts-ignore
    expect(actualError.message).to.deep.eq("value");
    expect(handlerContext.isDone).to.eq(true);
    expect(handlerContext.status).to.eq(AnyToPromiseStatus.REJECTED);
    expect(handlerContext.handle).to.have.been.callCount(0);
  });
  it("should return the value from PROMISE", async () => {
    const {handlerContext, $ctx} = await getHandlerContext({
      token: Test,
      propertyKey: "getValueWithPromise",
      args: ["value"]
    });

    // WHEN
    const result = await handlerContext.callHandler();

    // THEN
    expect(result).to.deep.eq({
      data: "value",
      state: "RESOLVED",
      type: "DATA"
    });
    expect($ctx.data).to.eq("value");
  });
  it("should return the value from BUFFER", async () => {
    const {handlerContext, $ctx} = await getHandlerContext({
      token: Test,
      propertyKey: "getBuffer",
      args: ["value"]
    });

    // WHEN
    const result = await handlerContext.callHandler();

    // THEN
    expect(Buffer.isBuffer(result.data)).to.eq(true);
    expect(Buffer.isBuffer($ctx.data)).to.eq(true);
    expect($ctx.data.toString("utf8")).to.eq("value");
  });
  it("should return the value from STREAM", async () => {
    const {handlerContext, $ctx} = await getHandlerContext({
      token: Test,
      propertyKey: "getStream",
      args: ["value"]
    });

    // WHEN
    const result = await handlerContext.callHandler();

    // THEN
    expect(isStream(result.data)).to.eq(true);
    expect(isStream($ctx.data)).to.eq(true);
  });
  it("should proxy axios/custom response", async () => {
    const {$ctx, handlerContext} = await getHandlerContext({
      token: Test,
      propertyKey: "getResponse",
      args: ["value"]
    });

    // WHEN
    const result = await handlerContext.callHandler();

    // THEN
    expect(result).to.deep.eq({
      data: "data",
      headers: {
        "Content-Type": "type"
      },
      state: "RESOLVED",
      status: 200,
      type: "DATA"
    });
    expect($ctx.data).to.eq("data");
  });
  it("should return the value from OBSERVABLE", async () => {
    const {$ctx, handlerContext} = await getHandlerContext({
      token: Test,
      propertyKey: "getObservable",
      args: ["value"]
    });

    // WHEN
    const result = await handlerContext.callHandler();

    // THEN
    expect(result).to.deep.eq({
      data: ["value"],
      state: "RESOLVED",
      type: "DATA"
    });
    expect($ctx.data).to.deep.eq(["value"]);
  });
  it("should return the value from FUNCTION", async () => {
    const {handlerContext} = await getHandlerContext({
      token: Test,
      propertyKey: "returnMiddleware",
      args: ["value"]
    });

    // WHEN
    const result = await handlerContext.callHandler();

    // THEN
    expect(result.data).to.be.a("function");
  });
  it("should call next immediately", async () => {
    const {handlerContext, $ctx} = await getHandlerContext({
      token: Test,
      propertyKey: "empty",
      args: ["value"]
    });

    // WHEN
    const result = await handlerContext.callHandler();

    // THEN
    expect(result).to.deep.eq({
      data: undefined,
      state: "RESOLVED",
      type: "DATA"
    });
    expect($ctx.data).to.eq(undefined);
  });
  it("should do nothing when response is returned", async () => {
    const {handlerContext, $ctx} = await getHandlerContext({
      token: Test,
      propertyKey: "getValue",
      args: []
    });

    handlerContext.args = [$ctx.getResponse()];

    // WHEN
    await handlerContext.callHandler();

    // THEN
    expect($ctx.data).to.eq(undefined);
  });
  it("should do nothing when response has already sent headers", async () => {
    const {handlerContext, $ctx} = await getHandlerContext({
      token: Test,
      propertyKey: "responseHeadersSent",
      args: []
    });

    handlerContext.args = [$ctx.getResponse()];

    // WHEN
    await handlerContext.callHandler();

    // THEN
    expect($ctx.data).to.eq(undefined);
  });
});
