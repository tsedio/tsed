import {afterEach, beforeEach, expect} from "vitest";

import {Injectable} from "../../common/index.js";
import {DIContext} from "../domain/DIContext.js";
import {DITest} from "../services/DITest.js";
import {runInContext} from "../utils/asyncHookContext.js";
import {InjectContext} from "./injectContext.js";

describe("InjectContext", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should inject a context", async () => {
    @Injectable()
    class MyService {
      @InjectContext()
      ctx: DIContext;
    }

    const $ctx = new DIContext({
      id: "test",
      logger: DITest.injector.logger,
      injector: DITest.injector,
      maxStackSize: 0
    });

    const myService = await DITest.invoke(MyService);

    await runInContext($ctx, () => {
      expect(myService.ctx).toBeInstanceOf(DIContext);
      expect(myService.ctx).toEqual($ctx);
    });

    expect(myService.ctx).toBeInstanceOf(DIContext);
    expect(myService.ctx).not.toEqual($ctx);
  });
  it("should inject a context and get value", async () => {
    @Injectable()
    class MyService {
      @InjectContext((o) => o.get("test"))
      test: string;
    }

    const $ctx = new DIContext({
      id: "test",
      logger: DITest.injector.logger,
      injector: DITest.injector,
      maxStackSize: 0
    });
    $ctx.set("test", "value");

    const myService = await DITest.invoke(MyService);

    await runInContext($ctx, () => {
      expect(myService.test).toEqual("value");
    });

    expect(myService.test).toEqual(undefined);
  });
});
