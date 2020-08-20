import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {SendResponseMiddleware} from "./SendResponseMiddleware";

const sandbox = Sinon.createSandbox();
describe("SendResponseMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should call PlatformResponseMiddleware", async () => {
    // GIVEN
    const middleware = await PlatformTest.invoke<SendResponseMiddleware>(SendResponseMiddleware);
    sandbox.stub(middleware.middleware, "use");

    const request = new FakeRequest();
    const response: any = new FakeResponse(sandbox);
    request.ctx = PlatformTest.createRequestContext();

    // WHEN
    const result = middleware.use(request as any, response as any);

    // THEN
    expect(middleware.middleware.use).to.have.been.calledWithExactly(request.ctx);
  });
});
