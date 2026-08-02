import {Container} from "./Container.js";
import {Provider} from "./Provider.js";
import {ProviderType} from "./ProviderType.js";

describe("Container", () => {
  describe("get()", () => {
    class Test {}

    it("should return a provider", () => {
      // GIVEN
      const container = new Container();
      const provider = new Provider(Test);

      container.add(Test, provider);

      // WHEN
      const result = container.get(Test);

      // THEN
      expect(result!).toBeInstanceOf(Provider);
    });
  });
  describe("getMany()", () => {
    let container: Container;

    beforeEach(() => {
      class MyMiddleware {}

      class MyService {}

      class MyController {}

      container = new Container();
      container.add(MyMiddleware, {type: ProviderType.MIDDLEWARE});
      container.add(MyService, {type: ProviderType.PROVIDER});
      container.add(MyController, {type: ProviderType.CONTROLLER});

      // await container.load();
    });

    it("should return middlewares only", () => {
      const providers = container.getMany(ProviderType.MIDDLEWARE);

      const result = providers.find((item: any) => item.type !== ProviderType.MIDDLEWARE);

      expect(providers[0].type).toEqual(ProviderType.MIDDLEWARE);
      expect(result).toBeUndefined();
    });

    it("should return controllers only", () => {
      const providers = container.getMany(ProviderType.CONTROLLER);

      const result = providers.find((item: any) => item.type !== ProviderType.CONTROLLER);

      expect(providers[0].type).toEqual(ProviderType.CONTROLLER);
      expect(result).toBeUndefined();
    });

    it("should return all providers", () => {
      const providers = container.getMany();
      const controllers = providers.filter((item: any) => item.type === ProviderType.CONTROLLER);
      const middlewares = providers.filter((item: any) => item.type === ProviderType.MIDDLEWARE);

      expect(providers.length > 0).toEqual(true);
      expect(controllers.length > 0).toEqual(true);
      expect(middlewares.length > 0).toEqual(true);
    });

    it("should return providers matching multiple types", () => {
      const providers = container.getMany([ProviderType.CONTROLLER, ProviderType.MIDDLEWARE]);
      const hasInvalidType = providers.some((item: any) => ![ProviderType.CONTROLLER, ProviderType.MIDDLEWARE].includes(item.type));

      expect(providers.length).toEqual(2);
      expect(hasInvalidType).toBe(false);
    });
  });
  describe("merge()", () => {
    it("should add providers", () => {
      class Test {}

      // GIVEN
      const container = new Container();
      const childContainer = new Container();
      childContainer.add(Test);

      // WHEN
      container.merge(childContainer);

      // THEN
      expect(container.get(Test)!).toBeInstanceOf(Provider);
    });
  });
});
