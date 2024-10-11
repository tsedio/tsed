import {Container} from "./Container.js";
import {Provider} from "./Provider.js";
import {ProviderType} from "./ProviderType.js";

describe("Container", () => {
  describe("getProvider()", () => {
    class Test {}

    it("should return a provider", () => {
      // GIVEN
      const container = new Container();
      const provider = new Provider(Test);

      container.add(Test, provider);

      // WHEN
      const result = container.getProvider(Test);

      // THEN
      expect(result!).toBeInstanceOf(Provider);
    });
  });
  describe("getProviders()", () => {
    let container: Container;

    beforeEach(() => {
      class MyMiddleware {}

      class MyService {}

      class MyController {}

      container = new Container();
      container.addProvider(MyMiddleware, {type: ProviderType.MIDDLEWARE});
      container.addProvider(MyService, {type: ProviderType.PROVIDER});
      container.addProvider(MyController, {type: ProviderType.CONTROLLER});

      // await container.load();
    });

    it("should return middlewares only", () => {
      const providers = container.getProviders(ProviderType.MIDDLEWARE);

      const result = providers.find((item: any) => item.type !== ProviderType.MIDDLEWARE);

      expect(providers[0].type).toEqual(ProviderType.MIDDLEWARE);
      expect(result).toBeUndefined();
    });

    it("should return controllers only", () => {
      const providers = container.getProviders(ProviderType.CONTROLLER);

      const result = providers.find((item: any) => item.type !== ProviderType.CONTROLLER);

      expect(providers[0].type).toEqual(ProviderType.CONTROLLER);
      expect(result).toBeUndefined();
    });

    it("should return all providers", () => {
      const providers = container.getProviders();
      const controllers = providers.filter((item: any) => item.type === ProviderType.CONTROLLER);
      const middlewares = providers.filter((item: any) => item.type === ProviderType.MIDDLEWARE);

      expect(providers.length > 0).toEqual(true);
      expect(controllers.length > 0).toEqual(true);
      expect(middlewares.length > 0).toEqual(true);
    });
  });
  describe("addProviders()", () => {
    it("should add providers", () => {
      class Test {}

      // GIVEN
      const container = new Container();
      const childContainer = new Container();
      childContainer.addProvider(Test);

      // WHEN
      container.addProviders(childContainer);

      // THEN
      expect(container.getProvider(Test)!).toBeInstanceOf(Provider);
    });
  });
});
