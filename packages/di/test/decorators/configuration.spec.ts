import {expect} from "chai";
import {Configuration, GlobalProviders, InjectorService, Provider} from "../../src";

describe("@Configuration", () => {
  it("should declare a new provider with custom configuration", () => {
    @Configuration({})
    class Test {
    }

    const provider = new Provider(Test);
    provider.injectable = false;
    provider.configuration = {};

    GlobalProviders.get(Test)!.should.deep.eq(provider);
  });

  it("should inject configuration", async () => {
    @Configuration({
      "feature": "feature"
    })
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
