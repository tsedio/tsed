import {Injectable, InjectorService, LazyInject, OptionalLazyInject} from "@tsed/di";
import type {MyLazyModule} from "./__mock__/lazy.module";
import {expect} from "chai";
import {catchAsyncError, classOf, nameOf} from "@tsed/core";

describe("LazyInject", () => {
  it("should lazy load module (import)", async () => {
    @Injectable()
    class MyInjectable {
      @LazyInject("MyLazyModule", () => import("./__mock__/lazy.import.module"))
      lazy: Promise<MyLazyModule>;
    }

    const injector = new InjectorService();
    const service = await injector.invoke<MyInjectable>(MyInjectable);
    const nbProviders = injector.getProviders().length;

    const lazyService = await service.lazy;

    expect(nameOf(classOf(lazyService))).to.eq("MyLazyModule");
    expect(nbProviders).to.not.eq(injector.getProviders().length);
  });

  it("should throw an error when token isn't a valid provider", async () => {
    @Injectable()
    class MyInjectable {
      @LazyInject("TKO", async () => await import("./__mock__/lazy.nodefault.module"))
      lazy?: Promise<MyLazyModule>;
    }

    const injector = new InjectorService();
    const service = await injector.invoke<MyInjectable>(MyInjectable);
    const error = await catchAsyncError(() => service.lazy);

    expect(error?.message).to.eq('Unable to lazy load the "TKO". The token isn\'t a valid token provider.');
  });

  it("should throw an error when the module doesn't exists", async () => {
    @Injectable()
    class MyInjectable {
      // @ts-ignore
      @LazyInject("Lazy", () => import("lazy-module"), {packageName: "lazy-module"})
      lazy?: Promise<MyLazyModule>;
    }

    const injector = new InjectorService();
    const service = await injector.invoke<MyInjectable>(MyInjectable);
    const error = await catchAsyncError(() => service.lazy);

    expect(error?.message).to.eq('The "lazy-module" package is missing.');
  });

  it("should lazy load optionally a module", async () => {
    @Injectable()
    class MyInjectable {
      // @ts-ignore
      @OptionalLazyInject("default", () => import("lazy-module-optional"))
      lazy?: Promise<MyLazyModule>;
    }

    const injector = new InjectorService();
    const service = await injector.invoke<MyInjectable>(MyInjectable);
    const lazyService = await service.lazy;

    expect(lazyService).to.deep.eq({});
  });
});
