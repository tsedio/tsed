import {$off, $on} from "@tsed/hooks";
import {DITest} from "../../node/services/DITest.js";
import {getContext, runInContext} from "./asyncHookContext.js";

describe("browser asyncHookContext", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  describe("runInContext()", () => {
    const ref = {};

    afterEach(() => $off(ref as any));

    it("should return the result of the callback, inside the context", () => {
      const ctx: any = {id: "id"};

      const result = runInContext(ctx, () => getContext(), DITest.injector);

      expect(result).toBe(ctx);
    });

    it("should not apply the $alterRunInContext listeners", () => {
      $on("$alterRunInContext", ref as any, (next: any) => () => `altered ${next()}`);

      const result = runInContext({id: "id"} as any, () => "result", DITest.injector);

      expect(result).toEqual("result");
    });
  });
});
