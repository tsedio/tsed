import {$off, $on} from "@tsed/hooks";
import {DITest} from "../../node/services/DITest.js";
import {getContext, runInContext} from "./asyncHookContext.js";

describe("browser asyncHookContext", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  describe("runInContext()", () => {
    const ref = {};

    afterEach(() => $off(ref as any));

    it("should return the result of a sync callback without a promise when no listener alters it", () => {
      const ctx: any = {id: "id"};

      const result = runInContext(ctx, () => getContext(), DITest.injector);

      expect(result).toBe(ctx);
    });

    it("should wait for a $alterRunInContext listener", async () => {
      $on("$alterRunInContext", ref as any, (next: any) => () => `altered ${next()}`);

      const result = runInContext({id: "id"} as any, () => "result", DITest.injector);

      expect(result).toBeInstanceOf(Promise);
      expect(await result).toEqual("altered result");
    });

    it("should always call a custom alterAsync", async () => {
      const injector = {alterAsync: vi.fn().mockResolvedValue(() => "custom")};

      const result = runInContext(undefined, () => "result", injector);

      expect(injector.alterAsync).toHaveBeenCalledWith("$alterRunInContext", expect.any(Function));
      expect(await result).toEqual("custom");
    });
  });
});
