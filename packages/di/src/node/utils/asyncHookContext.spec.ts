import {DITest} from "../services/DITest.js";
import {getContext, runInContext, setContext} from "./asyncHookContext.js";

describe("asyncHookContext", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());
  it("should initiate the async hook context - promise", async () => {
    const req = {type: "req"};
    const res = {type: "res"};

    function next(res: any, req: any) {
      return Promise.resolve(getContext());
    }

    function nextContext(res: any, req: any, next: any) {
      const $ctx: any = {
        id: "id",
        req,
        res
      };

      setContext($ctx);

      return next();
    }

    function app(req: any, res: any) {
      return runInContext(undefined, () => nextContext(req, res, () => next(req, res)), DITest.injector);
    }

    const result = await app(req, res);

    expect(result).toEqual({
      id: "id",
      req: {
        type: "res"
      },
      res: {
        type: "req"
      }
    });
  });
  it("should initiate the async hook context - promise - runInContext x2", async () => {
    const req = {type: "req"};
    const res = {type: "res"};

    function next(res: any, req: any) {
      return Promise.resolve(getContext());
    }

    function nextContext(res: any, req: any, next: any) {
      const $ctx: any = {
        id: "id",
        req,
        res
      };

      return runInContext($ctx, next);
    }

    function app(req: any, res: any) {
      return runInContext(undefined, () => nextContext(req, res, () => next(req, res)), DITest.injector);
    }

    const result = await app(req, res);

    expect(result).toEqual({
      id: "id",
      req: {
        type: "res"
      },
      res: {
        type: "req"
      }
    });
  });
  it("should initiate the async hook context - promise (initialValue)", async () => {
    const req = {type: "req"};
    const res = {type: "res"};

    function next(res: any, req: any) {
      return Promise.resolve(getContext({id: "id2"} as never));
    }

    function nextContext(res: any, req: any, next: any) {
      const $ctx: any = {
        id: "id",
        req,
        res
      };

      setContext($ctx);

      return next();
    }

    function app(req: any, res: any) {
      return runInContext(undefined, () => nextContext(req, res, () => next(req, res)), DITest.injector);
    }

    const result = await app(req, res);

    expect(result).toEqual({
      id: "id2"
    });
  });
  it("should initiate the async hook context - promise + setTimeout", async () => {
    const req = {type: "req"};
    const res = {type: "res"};

    function next(res: any, req: any) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getContext());
        }, 100);
      });
    }

    function nextContext(res: any, req: any, next: any) {
      const $ctx: any = {
        id: "id",
        req,
        res
      };

      setContext($ctx);

      return next();
    }

    function app(req: any, res: any) {
      return runInContext(undefined, () => nextContext(req, res, () => next(req, res)), DITest.injector);
    }

    const result = await app(req, res);

    expect(result).toEqual({
      id: "id",
      req: {
        type: "res"
      },
      res: {
        type: "req"
      }
    });
  });
});
