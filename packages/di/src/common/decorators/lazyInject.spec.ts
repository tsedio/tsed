import {catchAsyncError, classOf, nameOf} from "@tsed/core";

import {inject} from "../fn/inject.js";
import {injector} from "../fn/injector.js";
import type {MyLazyModule} from "./__mock__/lazy.module.js";
import {Injectable} from "./injectable.js";
import {LazyInject, OptionalLazyInject} from "./lazyInject.js";

describe("LazyInject", () => {
  it("should lazy load module (import)", async () => {
    @Injectable()
    class MyInjectable {
      @LazyInject("MyLazyModule", () => import("./__mock__/lazy.import.module.js"))
      lazy: Promise<MyLazyModule>;
    }

    const service = inject<MyInjectable>(MyInjectable);
    const nbProviders = injector().getProviders().length;

    const lazyService = await service.lazy;

    expect(nameOf(classOf(lazyService))).toEqual("MyLazyModule");
    expect(nbProviders).not.toEqual(injector().getProviders().length);
  });

  it("should throw an error when the module doesn't exists", async () => {
    @Injectable()
    class MyInjectable {
      // @ts-ignore
      @LazyInject("Lazy", () => import("lazy-module"), {})
      lazy?: Promise<MyLazyModule>;
    }

    const service = inject<MyInjectable>(MyInjectable);
    const error = await catchAsyncError(() => service.lazy);

    expect(error?.message).toContain("Failed to load url lazy-module");
  });

  it("should lazy load optionally a module", async () => {
    @Injectable()
    class MyInjectable {
      // @ts-ignore
      @OptionalLazyInject("default", () => import("lazy-module-optional"))
      lazy?: Promise<MyLazyModule>;
    }

    const service = inject(MyInjectable);
    const lazyService = await service.lazy;

    expect(lazyService).toEqual(undefined);
  });
});
