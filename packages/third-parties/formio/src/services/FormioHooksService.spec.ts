import {Store} from "@tsed/core";
import {Provider} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";

import {FormioHooksService} from "./FormioHooksService.js";
import {FormioService} from "./FormioService.js";

describe("FormioHooksService", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should wrap multiple 'alter' hooks", async () => {
    const service = await PlatformTest.invoke<FormioHooksService>(FormioHooksService);

    class Alter1 {
      transform(value: any) {
        return value + ":1";
      }
    }

    class Alter2 {
      transform(value: any) {
        return value + ":2";
      }
    }

    Store.from(Alter1).set("formio:alter:name", "hookName");
    Store.from(Alter2).set("formio:alter:name", "hookName");

    vi.spyOn(service as any, "getProviders").mockReturnValue([new Provider(Alter1), new Provider(Alter2)]);

    const hooks: any = service.getHooks();

    expect(hooks.alter.hookName).toBeInstanceOf(Function);

    expect(hooks.alter.hookName("init")).toEqual("init:1:2");
  });
  it("should wrap multiple 'alter' hooks with args", async () => {
    const service = await PlatformTest.invoke<FormioHooksService>(FormioHooksService);

    class Alter1 {
      transform(value: any, ...args: any[]) {
        return `${value}:1(${args.join(",")})`;
      }
    }

    class Alter2 {
      transform(value: any, ...args: any[]) {
        return `${value}:2(${args.join(",")})`;
      }
    }

    Store.from(Alter1).set("formio:alter:name", "hookName");
    Store.from(Alter2).set("formio:alter:name", "hookName");

    vi.spyOn(service as any, "getProviders").mockReturnValue([new Provider(Alter1), new Provider(Alter2)]);

    const hooks: any = service.getHooks();

    expect(hooks.alter.hookName).toBeInstanceOf(Function);

    expect(hooks.alter.hookName("init", "hello")).toEqual("init:1(hello):2(hello)");
  });
  it("should wrap multiple 'on' hooks", async () => {
    const service = await PlatformTest.invoke<FormioHooksService>(FormioHooksService);

    class On1 {
      on(value: any) {
        return value + ":1";
      }
    }

    class On2 {
      on(value: any) {
        return value + ":2";
      }
    }

    Store.from(On1).set("formio:on:name", "hookName");
    Store.from(On2).set("formio:on:name", "hookName");

    vi.spyOn(service as any, "getProviders").mockReturnValue([new Provider(On1), new Provider(On2)]);

    const hooks: any = service.getHooks();

    expect(hooks.on.hookName).toBeInstanceOf(Function);
    expect(hooks.on.hookName("init")).toEqual("init:2");
  });
  it("should return settings method", async () => {
    const formio = {
      hook: {
        settings: vi.fn()
      }
    };

    const service = await PlatformTest.invoke<FormioHooksService>(FormioHooksService, [
      {
        use: formio,
        token: FormioService
      }
    ]);

    expect(service.settings).toEqual(formio.hook.settings);
  });

  it("should return invoke method", async () => {
    const formio = {
      hook: {
        invoke: vi.fn()
      }
    };

    const service = await PlatformTest.invoke<FormioHooksService>(FormioHooksService, [
      {
        use: formio,
        token: FormioService
      }
    ]);

    expect(service.invoke).toEqual(formio.hook.invoke);
  });

  it("should return alter method", async () => {
    const formio = {
      hook: {
        alter: vi.fn()
      }
    };

    const service = await PlatformTest.invoke<FormioHooksService>(FormioHooksService, [
      {
        use: formio,
        token: FormioService
      }
    ]);

    expect(service.alter).toEqual(formio.hook.alter);
  });

  it("should return alterAsync method", async () => {
    const formio = {
      hook: {
        alter: vi.fn()
      }
    };

    const service = await PlatformTest.invoke<FormioHooksService>(FormioHooksService, [
      {
        use: formio,
        token: FormioService
      }
    ]);

    expect(typeof service.alterAsync).toEqual("function");
  });
});
