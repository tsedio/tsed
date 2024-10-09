import {catchAsyncError, classOf, nameOf} from "@tsed/core";

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

    const inj = injector({rebuild: true});
    const service = await inj.invoke<MyInjectable>(MyInjectable);
    const nbProviders = inj.getProviders().length;

    const lazyService = await service.lazy;

    expect(nameOf(classOf(lazyService))).toEqual("MyLazyModule");
    expect(nbProviders).not.toEqual(inj.getProviders().length);
  });

  it("should throw an error when token isn't a valid provider", async () => {
    @Injectable()
    class MyInjectable {
      @LazyInject("TKO", () => import("./__mock__/lazy.nodefault.module.js"))
      lazy?: Promise<MyLazyModule>;
    }

    const inj = injector({rebuild: true});
    const service = await inj.invoke<MyInjectable>(MyInjectable);
    const error = await catchAsyncError(() => service.lazy);

    expect(error?.message).toEqual('Unable to lazy load the "TKO". The token isn\'t a valid token provider.');
  });

  it("should throw an error when the module doesn't exists", async () => {
    @Injectable()
    class MyInjectable {
      // @ts-ignore
      @LazyInject("Lazy", () => import("lazy-module"), {packageName: "lazy-module"})
      lazy?: Promise<MyLazyModule>;
    }

    const inj = injector({rebuild: true});
    const service = await inj.invoke<MyInjectable>(MyInjectable);
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

    const inj = injector({rebuild: true});
    const service = await inj.invoke<MyInjectable>(MyInjectable);
    const lazyService = await service.lazy;

    expect(lazyService).toEqual({});
  });

  it("should not return undefined if the package is imported but the bean has not been assigned yet", async () => {
    @Injectable()
    class MyInjectable {
      @LazyInject("MyLazyModule", () => import("./__mock__/lazy.import.module.js"))
      lazy: Promise<MyLazyModule>;
    }

    const inj = injector({rebuild: true});
    const service = await inj.invoke<MyInjectable>(MyInjectable);
    const originalLazyInvoke = inj.lazyInvoke.bind(inj);
    const promise1 = service.lazy;
    let promise2: Promise<MyLazyModule> | undefined;

    vi.spyOn(inj, "lazyInvoke").mockImplementationOnce((token) => {
      promise2 = service.lazy;
      return originalLazyInvoke(token);
    });

    const lazyService1 = await promise1;
    const lazyService2 = await promise2;
    expect(lazyService1).not.toBeUndefined();
    expect(lazyService2).not.toBeUndefined();
  });
});
