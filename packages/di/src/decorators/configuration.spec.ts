import {Store} from "@tsed/core";
import {Container, GlobalProviders, Injectable, InjectorService, Provider} from "@tsed/di";
import {expect} from "chai";
import {Configuration} from "./configuration";

describe("@Configuration", () => {
  it("should declare a new provider with custom configuration", () => {
    @Configuration({})
    class Test {}

    const provider = new Provider(Test);
    provider.injectable = false;
    provider.configuration = {};

    expect(Store.from(Test).get("configuration")).to.deep.eq({});
  });

  it("should inject configuration", async () => {
    @Configuration({
      feature: "feature"
    })
    @Injectable()
    class Test {
      constructor(@Configuration() public config: Configuration) {}
    }

    const injector = new InjectorService();
    const container = new Container();

    injector.setProvider(Test, GlobalProviders.get(Test)!.clone());

    await injector.load(container);

    const instance = injector.invoke<Test>(Test);

    expect(instance.config).to.eq(injector.settings);
    expect(instance.config.get("feature")).to.eq("feature");
  });
});
