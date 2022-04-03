import {isPromise} from "@tsed/core";
import {expect} from "chai";
import {Container, GlobalProviders, Inject, Injectable, InjectorService, registerProvider} from "../../src";

describe("DI", () => {
  describe("create new injector", () => {
    const ASYNC_FACTORY = Symbol.for("ASYNC_FACTORY");

    registerProvider({
      provide: ASYNC_FACTORY,
      useAsyncFactory() {
        return Promise.resolve({
          connection: true,
          close() {}
        });
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

    after(() => {
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
      expect(isPromise(server.asyncFactory)).to.eq(true);

      // WHEN
      await injector.load(container);

      expect(isPromise(server.asyncFactory)).to.eq(false);
      expect(server.asyncFactory.connection).to.deep.eq(true);
    });
  });
});
