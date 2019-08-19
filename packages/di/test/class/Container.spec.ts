import {expect} from "chai";
import {Container, Provider, ProviderType} from "../../src";

describe("Container", () => {
  describe("getProvider()", () => {
    class Test {
    }

    it("should return a provider", () => {
      // GIVEN
      const container = new Container();
      const provider = new Provider(Test);

      container.add(Test, provider);

      // WHEN
      const result = container.getProvider(Test);

      // THEN
      result!.should.instanceof(Provider);
    });
  });
  describe("getProviders()", () => {
    let container: Container;

    beforeEach(async () => {
      class MyMiddleware {
      }

      class MyService {
      }

      class MyController {
      }

      container = new Container();
      container.addProvider(MyMiddleware, {type: ProviderType.MIDDLEWARE});
      container.addProvider(MyService, {type: ProviderType.SERVICE});
      container.addProvider(MyController, {type: ProviderType.CONTROLLER});

      // await container.load();
    });

    it("should return middlewares only", () => {
      const providers = container.getProviders(ProviderType.MIDDLEWARE);

      const result = providers.find((item: any) => item.type !== ProviderType.MIDDLEWARE);

      providers[0].type.should.eq(ProviderType.MIDDLEWARE);
      expect(result).to.eq(undefined);
    });

    it("should return controllers only", () => {
      const providers = container.getProviders(ProviderType.CONTROLLER);

      const result = providers.find((item: any) => item.type !== ProviderType.CONTROLLER);

      providers[0].type.should.eq(ProviderType.CONTROLLER);
      expect(result).to.eq(undefined);
    });

    it("should return all providers", () => {
      const providers = container.getProviders();
      const controllers = providers.filter((item: any) => item.type === ProviderType.CONTROLLER);
      const middlewares = providers.filter((item: any) => item.type === ProviderType.MIDDLEWARE);

      expect(providers.length > 0).to.eq(true);
      expect(controllers.length > 0).to.eq(true);
      expect(middlewares.length > 0).to.eq(true);
    });
  });
  describe("addProviders()", () => {
    it("should add providers", () => {
      class Test {
      }

      // GIVEN
      const container = new Container();
      const childContainer = new Container();
      childContainer.addProvider(Test);

      // WHEN
      container.addProviders(childContainer);

      // THEN
      container.getProvider(Test)!.should.instanceof(Provider);
    });
  });
});
