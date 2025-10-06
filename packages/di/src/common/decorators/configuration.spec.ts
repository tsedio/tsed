import {Store} from "@tsed/core";
import {afterEach} from "vitest";

import {Container} from "../domain/Container.js";
import {Provider} from "../domain/Provider.js";
import {destroyInjector, injector} from "../fn/injector.js";
import {GlobalProviders} from "../registries/GlobalProviders.js";
import {Configuration} from "./configuration.js";
import {Injectable} from "./injectable.js";

describe("@Configuration", () => {
  afterEach(() => destroyInjector());
  it("should declare a new provider with custom configuration", () => {
    @Configuration({})
    class Test {}

    const provider = new Provider(Test);
    provider.injectable = false;
    provider.configuration = {};

    expect(Store.from(Test).get("configuration")).toEqual({});
  });

  it("should inject configuration (constructor)", async () => {
    @Configuration({
      feature: "feature"
    })
    @Injectable()
    class Test {
      constructor(@Configuration() public config: Configuration) {}
    }

    const container = new Container();

    injector().setProvider(Test, GlobalProviders.get(Test)!.clone());

    await injector().load(container);

    const instance = injector().invoke<Test>(Test);

    expect(instance.config).toEqual(injector().settings);
    expect(instance.config.get("feature")).toEqual("feature");
  });
  it("should inject configuration (props)", async () => {
    @Injectable()
    class Test {
      @Configuration() public config: Configuration;

      constructor() {}
    }

    const container = new Container();

    injector().setProvider(Test, GlobalProviders.get(Test)!.clone());

    await injector().load(container);

    const instance = injector().invoke<Test>(Test);

    expect(instance.config).toEqual(injector().settings);
  });
});
