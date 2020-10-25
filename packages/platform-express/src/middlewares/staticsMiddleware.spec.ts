import {expect} from "chai";
import * as Express from "express";
import * as Sinon from "sinon";
import {stub} from "../../../../test/helper/tools";
import {staticsMiddleware} from "./staticsMiddleware";

const sandbox = Sinon.createSandbox();

describe("staticsMiddleware", () => {
  beforeEach(async () => {
    sandbox.stub(Express, "static");
  });

  afterEach(() => {
    sandbox.restore();
  });
  it("should call middleware", () => {
    const middlewareServeStatic = sandbox.stub();
    stub(Express.static).returns(middlewareServeStatic);
    const req = {};
    const res = {};
    const next = sandbox.stub();

    const middleware = staticsMiddleware("/path", {root: "/publics", test: "test"});
    middleware(req, res, next);

    expect(middlewareServeStatic).to.have.been.calledWithExactly(req, res, next);
  });
  it("should call next when headers is sent", () => {
    const middlewareServeStatic = sandbox.stub();
    stub(Express.static).returns(middlewareServeStatic);
    const req = {};
    const res = {
      headersSent: true
    };
    const next = sandbox.stub();

    const middleware = staticsMiddleware("/path", {root: "/publics", test: "test"});
    middleware(req, res, next);

    expect(next).to.have.been.called;
  });
});
