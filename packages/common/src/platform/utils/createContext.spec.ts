import {PlatformResponse, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {stub} from "../../../../../test/helper/tools";
import {createContext} from "./createContext";

const sandbox = Sinon.createSandbox();
describe("createContext", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  afterEach(() => sandbox.restore());
  it("should create context and attach it to the request", async () => {
    // GIVEN
    const injector = PlatformTest.injector;
    const request: any = new FakeRequest(sandbox);
    const response: any = new FakeResponse();
    response.req = request;

    sandbox.stub(injector, "emit");
    sandbox.stub(PlatformResponse.prototype, "onEnd");

    // WHEN

    const ctx = await createContext(injector, request, response);

    // THEN
    expect(request.$ctx).to.eq(ctx);
    expect(injector.emit).to.have.been.calledWithExactly("$onRequest", ctx);
    expect(ctx.response.onEnd).to.have.been.calledWithExactly(Sinon.match.func);

    await stub(ctx.response.onEnd).getCall(0).args[0](ctx);

    expect(injector.emit).to.have.been.calledWithExactly("$onResponse", ctx);
    expect(request.$ctx).to.eq(undefined);
  });

  it("should add a x-request-id header to the response", async () => {
    // GIVEN
    const injector = PlatformTest.injector;
    const request: any = new FakeRequest(sandbox);
    const response: any = new FakeResponse();
    response.req = request;

    sandbox.stub(PlatformResponse.prototype, "setHeader");

    // WHEN
    const ctx = await createContext(injector, request, response);

    // THEN
    expect(ctx.response.setHeader).to.have.been.calledWithMatch("x-request-id", /\w+/);
  });

  it("should use an existing x-request-id request header for the response x-request-id header", async () => {
    // GIVEN
    const injector = PlatformTest.injector;
    const request: any = new FakeRequest({
      ...sandbox,
      headers: {
        "x-request-id": "test-id"
      }
    });
    const response: any = new FakeResponse();
    response.req = request;

    sandbox.stub(PlatformResponse.prototype, "setHeader");

    // WHEN
    const ctx = await createContext(injector, request, response);

    // THEN
    expect(ctx.response.setHeader).to.have.been.calledWithMatch("x-request-id", "test-id");
  });
});
