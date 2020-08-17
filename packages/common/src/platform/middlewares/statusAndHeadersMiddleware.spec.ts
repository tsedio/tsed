import {EndpointMetadata, Get} from "@tsed/common";
import {Returns} from "@tsed/schema";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {statusAndHeadersMiddleware} from "./statusAndHeadersMiddleware";

const sandbox = Sinon.createSandbox();
describe("statusAndHeadersMiddleware", () => {
  it("should set status and header", async () => {
    const request: any = new FakeRequest();
    const response: any = new FakeResponse(sandbox);

    class Test {
      @Get("/")
      @(Returns(200).Header("x-header", "test"))
      test() {}
    }

    request.ctx.endpoint = EndpointMetadata.get(Test, "test");

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

    class Test {
      @Get("/")
      @(Returns(201).Header("x-header", "test-2"))
      @(Returns(400).Header("x-header", "test-1"))
      test() {}
    }

    request.ctx.endpoint = EndpointMetadata.get(Test, "test");

    // WHEN
    response.statusCode = 201;
    await new Promise(resolve => {
      statusAndHeadersMiddleware(request, response, resolve);
    });

    // THEN
    expect(response.set).to.have.been.calledWithExactly("x-header", "test-2");

    // WHEN
    response.statusCode = 400;
    await new Promise(resolve => {
      statusAndHeadersMiddleware(request, response, resolve);
    });

    // THEN
    expect(response.set).to.have.been.calledWithExactly("x-header", "test-1");
  });
});
