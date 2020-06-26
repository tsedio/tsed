import {expect} from "chai";
import {EndpointMetadata} from "@tsed/common";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {statusAndHeadersMiddleware} from "./statusAndHeadersMiddleware";

class Test {
  test() {}
}

const sandbox = Sinon.createSandbox();
describe("statusAndHeadersMiddleware", () => {
  it("should set status and header", async () => {
    const request: any = new FakeRequest();
    const response: any = new FakeResponse(sandbox);

    request.ctx.endpoint = new EndpointMetadata({
      target: Test,
      propertyKey: "test"
    });
    request.ctx.endpoint.responses.set(200, {
      headers: {
        "x-header": {
          value: "test"
        }
      }
    });

    // WHEN
    await new Promise(resolve => {
      statusAndHeadersMiddleware(request, response, resolve);
    });

    // THEN
    expect(response.set).to.have.been.calledWithExactly("x-header", "test");
    expect(response.status).to.have.been.calledWithExactly(200);
  });

  it("should set header", async () => {
    const request: any = new FakeRequest();
    const response: any = new FakeResponse(sandbox);
    response.statusCode = 201;
    request.ctx.endpoint = new EndpointMetadata({
      target: Test,
      propertyKey: "test"
    });
    request.ctx.endpoint.statusCode = 201;
    request.ctx.endpoint.responses.set(201, {
      headers: {
        "x-header": {
          value: "test"
        }
      }
    });

    // WHEN
    await new Promise(resolve => {
      statusAndHeadersMiddleware(request, response, resolve);
    });

    // THEN
    expect(response.set).to.have.been.calledWithExactly("x-header", "test");
  });
});
