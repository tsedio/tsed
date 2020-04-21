import {HandlerMetadata, HandlerType} from "@tsed/common";
import {isStream} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {expect} from "chai";
import {createReadStream} from "fs";
import {of} from "rxjs";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {HandlerContext} from "./HandlerContext";

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
  const injector = new InjectorService();
  injector.addProvider(Test);

  const metadata = new HandlerMetadata({
    target: token,
    token,
    propertyKey,
    type: HandlerType.CONTROLLER
  });
  const request: any = new FakeRequest();
  const response: any = new FakeResponse();
  const next = () => {};

  const handlerContext: HandlerContext = new HandlerContext({
    injector,
    metadata,
    request,
    response,
    args,
    next
  });

  return {
    response,
    request,
    handlerContext,
    run() {
      return new Promise(resolve => {
        if (!handlerContext.isDone) {
          // @ts-ignore
          handlerContext._next = resolve;
        }
        handlerContext.callHandler().catch(err => handlerContext.next(err));
      });
    }
  };
}

describe("HandlerContext", () => {
  it("should declare a new HandlerContext and return value", async () => {
    const {request, run, handlerContext} = await getHandlerContext({
      token: Test,
      propertyKey: "getValue",
      args: ["value"]
    });

    Sinon.spy(handlerContext, "handle");

    // WHEN
    const result = await run();
    run();

    // THEN
    expect(result).to.eq(undefined);
    expect(request.ctx.data).to.eq("value");
    expect(handlerContext.isDone).to.eq(true);
    expect(handlerContext.injector).to.eq(undefined);
    expect(handlerContext.metadata).to.eq(undefined);
    expect(handlerContext.request).to.eq(undefined);
    expect(handlerContext.response).to.eq(undefined);
    expect(handlerContext.args).to.eq(undefined);
    // @ts-ignore
    expect(handlerContext._next).to.eq(undefined);
    handlerContext.handle.should.have.been.calledWithExactly("value");
    handlerContext.handle.should.have.been.callCount(1);
  });
  it("should declare a new HandlerContext and catch error", async () => {
    const {request, run, handlerContext} = await getHandlerContext({
      token: Test,
      propertyKey: "catchError",
      args: ["value"]
    });

    Sinon.spy(handlerContext, "handle");

    // WHEN
    const result = await run();

    // THEN
    // @ts-ignore
    expect(result.message).to.deep.eq("value");
    expect(request.ctx.data).to.eq(undefined);
    expect(handlerContext.isDone).to.eq(true);
    expect(handlerContext.injector).to.eq(undefined);
    expect(handlerContext.metadata).to.eq(undefined);
    expect(handlerContext.request).to.eq(undefined);
    expect(handlerContext.response).to.eq(undefined);
    expect(handlerContext.args).to.eq(undefined);
    // @ts-ignore
    expect(handlerContext._next).to.eq(undefined);

    handlerContext.handle.should.have.been.callCount(0);
  });
  it("should return the value from PROMISE", async () => {
    const {request, run} = await getHandlerContext({
      token: Test,
      propertyKey: "getValueWithPromise",
      args: ["value"]
    });

    // WHEN
    const result = await run();

    // THEN
    expect(result).to.eq(undefined);
    expect(request.ctx.data).to.eq("value");
  });
  it("should return the value from BUFFER", async () => {
    const {run, request} = await getHandlerContext({
      token: Test,
      propertyKey: "getBuffer",
      args: ["value"]
    });

    // WHEN
    const result = await run();

    // THEN
    expect(result).to.eq(undefined);
    expect(Buffer.isBuffer(request.ctx.data)).to.eq(true);
    expect(request.ctx.data.toString("utf8")).to.eq("value");
  });
  it("should return the value from STREAM", async () => {
    const {run, request} = await getHandlerContext({
      token: Test,
      propertyKey: "getStream",
      args: ["value"]
    });

    // WHEN
    const result = await run();

    // THEN
    expect(result).to.eq(undefined);
    expect(isStream(request.ctx.data)).to.eq(true);
  });
  it("should proxy axios/custom response", async () => {
    const {run, request} = await getHandlerContext({
      token: Test,
      propertyKey: "getResponse",
      args: ["value"]
    });

    // WHEN
    const result = await run();

    // THEN
    expect(result).to.eq(undefined);
    expect(request.ctx.data).to.eq("data");
  });
  it("should return the value from OBSERVABLE", async () => {
    const {run, request} = await getHandlerContext({
      token: Test,
      propertyKey: "getObservable",
      args: ["value"]
    });

    // WHEN
    const result = await run();

    // THEN
    expect(result).to.eq(undefined);
    expect(request.ctx.data).to.deep.eq(["value"]);
  });
  it("should return the value from FUNCTION", async () => {
    const {run} = await getHandlerContext({
      token: Test,
      propertyKey: "returnMiddleware",
      args: ["value"]
    });

    // WHEN
    const result = await run();

    // THEN
    expect(result).to.eq(undefined);
  });
  it("should call next immediately", async () => {
    const {run, request} = await getHandlerContext({
      token: Test,
      propertyKey: "empty",
      args: ["value"]
    });

    // WHEN
    const result = await run();

    // THEN
    expect(result).to.eq(undefined);
    expect(request.ctx.data).to.eq(undefined);
  });
  it("should do nothing when response is returned", async () => {
    const {run, request, handlerContext, response} = await getHandlerContext({
      token: Test,
      propertyKey: "getValue",
      args: []
    });

    handlerContext.args = [response];

    // WHEN
    run();

    // THEN
    expect(request.ctx.data).to.eq(undefined);
  });
  it("should do nothing when response has already sent headers", async () => {
    const {run, request, handlerContext, response} = await getHandlerContext({
      token: Test,
      propertyKey: "responseHeadersSent",
      args: []
    });

    handlerContext.args = [response];

    // WHEN
    run();

    // THEN
    expect(request.ctx.data).to.eq(undefined);
    expect(response.headersSent).to.eq(true);
  });
  it("should do when request is aborted", async () => {
    const {request, handlerContext} = await getHandlerContext({
      token: Test,
      propertyKey: "getValue",
      args: []
    });

    request.aborted = true;
    Sinon.stub(handlerContext, "next");

    // WHEN
    handlerContext.done(null, {});

    // THEN
    return handlerContext.next.should.not.have.been.called;
  });
  it("should do when request is detached", async () => {
    const {request, handlerContext} = await getHandlerContext({
      token: Test,
      propertyKey: "getValue",
      args: []
    });

    delete handlerContext.request;
    Sinon.stub(handlerContext, "next");

    // WHEN
    handlerContext.done(null, {});

    // THEN
    return handlerContext.next.should.not.have.been.called;
  });
  it("should do when response is detached", async () => {
    const {request, handlerContext} = await getHandlerContext({
      token: Test,
      propertyKey: "getValue",
      args: []
    });

    delete handlerContext.response;
    Sinon.stub(handlerContext, "next");

    // WHEN
    handlerContext.done(null, {});

    // THEN
    return handlerContext.next.should.not.have.been.called;
  });
});
