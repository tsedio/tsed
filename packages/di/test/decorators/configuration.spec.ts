import {expect} from "chai";
import {Store} from "../../../core/src";
import {Configuration, GlobalProviders, Injectable, InjectorService, Provider} from "../../src";

describe("@Configuration", () => {
  it("should declare a new provider with custom configuration", () => {
    @Configuration({})
    class Test {
    }

    const provider = new Provider(Test);
    provider.injectable = false;
    provider.configuration = {};

    Store.from(Test).get("configuration").should.deep.eq({});
  });

  it("should inject configuration", async () => {
    @Configuration({
      "feature": "feature"
    })
    @Injectable()
    class Test {
      constructor(@Configuration() public config: Configuration) {
      }
    }

    const injector = new InjectorService();

    injector.setProvider(Test, GlobalProviders.get(Test)!.clone());

    await injector.load();

    const instance = injector.invoke<Test>(Test);

    expect(instance.config).to.eq(injector.settings);
    expect(instance.config.get("feature")).to.eq("feature");
  });
});
