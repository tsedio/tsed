import Express from "express";

import {staticsMiddleware} from "./staticsMiddleware.js";

describe("staticsMiddleware", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  it("should call middleware", () => {
    const middlewareServeStatic = vi.fn();
    vi.spyOn(Express, "static").mockReturnValue(middlewareServeStatic);
    const req = {};
    const res = {};
    const next = vi.fn();

    const middleware = staticsMiddleware("/path", {root: "/publics", test: "test"});
    middleware(req, res, next);

    expect(middlewareServeStatic).toHaveBeenCalledWith(req, res, next);
  });
  it("should call next when headers is sent", () => {
    const middlewareServeStatic = vi.fn();
    vi.spyOn(Express, "static").mockReturnValue(middlewareServeStatic);
    const req = {};
    const res = {
      headersSent: true
    };
    const next = vi.fn();

    const middleware = staticsMiddleware("/path", {root: "/publics", test: "test"});
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
