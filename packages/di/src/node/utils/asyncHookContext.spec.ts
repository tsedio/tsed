import {getContext, runInContext, setContext} from "./asyncHookContext.js";
import {$off, $on} from "@tsed/hooks";
import {DITest} from "../services/DITest.js";

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

  describe("$alterRunInContext", () => {
    const ref = {};

    afterEach(() => $off(ref as any));

    it("should run the callback synchronously when no listener alters it", async () => {
      const cb = vi.fn().mockReturnValue("result");
      const alterAsync = vi.spyOn(DITest.injector, "alterAsync");

      const promise = runInContext({id: "id"} as any, cb, DITest.injector);

      expect(cb).toHaveBeenCalledTimes(1);
      expect(alterAsync).not.toHaveBeenCalled();
      expect(await promise).toEqual("result");
    });

    it("should run the callback altered by a listener", async () => {
      const cb = vi.fn().mockReturnValue("result");

      $on("$alterRunInContext", ref as any, (next: any) => () => `altered ${next()}`);

      const result = await runInContext({id: "id"} as any, cb, DITest.injector);

      expect(result).toEqual("altered result");
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });
});
