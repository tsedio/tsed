import {PlatformTest, Provider} from "@tsed/common";
import {Store} from "@tsed/core";
import {FormioService} from "@tsed/formio";
import {expect} from "chai";
import Sinon from "sinon";
import {FormioHooksService} from "./FormioHooksService";

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

    // @ts-ignore
    Sinon.stub(service, "getProviders").returns([new Provider(Alter1), new Provider(Alter2)]);

    const hooks: any = service.getHooks();

    expect(hooks.alter.hookName).to.be.a("function");

    expect(hooks.alter.hookName("init")).to.equal("init:1:2");
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

    // @ts-ignore
    Sinon.stub(service, "getProviders").returns([new Provider(Alter1), new Provider(Alter2)]);

    const hooks: any = service.getHooks();

    expect(hooks.alter.hookName).to.be.a("function");

    expect(hooks.alter.hookName("init", "hello")).to.equal("init:1(hello):2(hello)");
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

    // @ts-ignore
    Sinon.stub(service, "getProviders").returns([new Provider(On1), new Provider(On2)]);

    const hooks: any = service.getHooks();

    expect(hooks.on.hookName).to.be.a("function");
    expect(hooks.on.hookName("init")).to.equal("init:2");
  });
  it("should return settings method", async () => {
    const formio = {
      hook: {
        settings: Sinon.stub()
      }
    };

    const service = await PlatformTest.invoke<FormioHooksService>(FormioHooksService, [
      {
        use: formio,
        token: FormioService
      }
    ]);

    expect(service.settings).to.deep.equal(formio.hook.settings);
  });

  it("should return invoke method", async () => {
    const formio = {
      hook: {
        invoke: Sinon.stub()
      }
    };

    const service = await PlatformTest.invoke<FormioHooksService>(FormioHooksService, [
      {
        use: formio,
        token: FormioService
      }
    ]);

    expect(service.invoke).to.deep.equal(formio.hook.invoke);
  });

  it("should return alter method", async () => {
    const formio = {
      hook: {
        alter: Sinon.stub()
      }
    };

    const service = await PlatformTest.invoke<FormioHooksService>(FormioHooksService, [
      {
        use: formio,
        token: FormioService
      }
    ]);

    expect(service.alter).to.deep.equal(formio.hook.alter);
  });

  it("should return alterAsync method", async () => {
    const formio = {
      hook: {
        alter: Sinon.stub()
      }
    };

    const service = await PlatformTest.invoke<FormioHooksService>(FormioHooksService, [
      {
        use: formio,
        token: FormioService
      }
    ]);

    expect(typeof service.alterAsync).to.deep.equal("function");
  });
});
