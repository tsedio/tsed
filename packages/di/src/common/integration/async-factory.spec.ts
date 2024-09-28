import {isPromise} from "@tsed/core";

import {Inject} from "../decorators/inject.js";
import {Injectable} from "../decorators/injectable.js";
import {Container} from "../domain/Container.js";
import {GlobalProviders} from "../registries/GlobalProviders.js";
import {registerProvider} from "../registries/ProviderRegistry.js";
import {InjectorService} from "../services/InjectorService.js";

describe("DI", () => {
  describe("create new injector", () => {
    const ASYNC_FACTORY = Symbol.for("ASYNC_FACTORY");

    registerProvider({
      provide: ASYNC_FACTORY,

      useAsyncFactory() {
        return {
          connection: true,
          close() {}
        };
      },
      hooks: {
        $onDestroy(instance: any) {
          return instance.close();
        }
      }
    });

    @Injectable()
    class Server {
      @Inject(ASYNC_FACTORY)
      asyncFactory: any;
    }

    afterAll(() => {
      GlobalProviders.delete(Server);
      GlobalProviders.delete(ASYNC_FACTORY);
    });

    it("should load all providers with the SINGLETON scope only", async () => {
      // GIVEN
      const injector = new InjectorService();
      const container = new Container();
      container.add(ASYNC_FACTORY);
      container.add(Server);

      const server = injector.invoke<any>(Server);
      expect(isPromise(server.asyncFactory)).toEqual(true);

      // WHEN
      await injector.load(container);

      expect(isPromise(server.asyncFactory)).toEqual(false);
      expect(server.asyncFactory.connection).toEqual(true);
    });
  });
});
