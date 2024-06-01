import Express from "express";
import {staticsMiddleware} from "./staticsMiddleware.js";

describe("staticsMiddleware", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("should call middleware", () => {
    const middlewareServeStatic = jest.fn();
    jest.spyOn(Express, "static").mockReturnValue(middlewareServeStatic);
    const req = {};
    const res = {};
    const next = jest.fn();

    const middleware = staticsMiddleware("/path", {root: "/publics", test: "test"});
    middleware(req, res, next);

    expect(middlewareServeStatic).toBeCalledWith(req, res, next);
  });
  it("should call next when headers is sent", () => {
    const middlewareServeStatic = jest.fn();
    jest.spyOn(Express, "static").mockReturnValue(middlewareServeStatic);
    const req = {};
    const res = {
      headersSent: true
    };
    const next = jest.fn();

    const middleware = staticsMiddleware("/path", {root: "/publics", test: "test"});
    middleware(req, res, next);

    expect(next).toBeCalled();
  });
});
