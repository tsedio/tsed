import {expect} from "chai";
import {Container, InjectorService, TokenProvider} from "../../src";

describe("DI Resolvers", () => {
  describe("create new injector", () => {
    it("should load all providers with the SINGLETON scope only", async () => {
      class ExternalService {
        constructor() {
        }
      }

      class MyService {
        constructor(public externalService: ExternalService) {

        }
      }

      // GIVEN
      const injector = new InjectorService();
      injector.resolvers.push({
        get<T = any>(type: TokenProvider): T | undefined {
          return type === ExternalService ? "MyClass" as any : undefined;
        }
      });

      const providers = new Container();
      providers.add(MyService, {
        deps: [ExternalService]
      });

      // WHEN
      await injector.load(providers);

      // THEN
      expect(injector.get(MyService)).to.instanceOf(MyService);
      expect(injector.get<MyService>(MyService)!.externalService).to.eq("MyClass");
    });
  });
});
