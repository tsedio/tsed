import {isPromise} from "@tsed/core";
import {afterEach} from "vitest";

import {injectable, Provider} from "../../..";
import {Inject} from "../decorators/inject.js";
import {Injectable} from "../decorators/injectable.js";
import {Container} from "../domain/Container.js";
import {destroyInjector, injector} from "../fn/injector.js";

describe("DI", () => {
  afterEach(() => destroyInjector());
  describe("create new injector", () => {
    const ASYNC_FACTORY = Symbol.for("ASYNC_FACTORY");

    injectable(ASYNC_FACTORY)
      .asyncFactory(async () => {
        return {
          connection: true,
          close() {}
        };
      })
      .hooks({
        $onDestroy(instance: any) {
          return instance.close();
        }
      })
      .token();

    @Injectable()
    class Server {
      @Inject(ASYNC_FACTORY)
      asyncFactory: any;
    }

    afterAll(() => {
      Provider.Registry.delete(Server);
      Provider.Registry.delete(ASYNC_FACTORY);
    });

    it("should load all providers with the SINGLETON scope only", async () => {
      // GIVEN
      const container = new Container();
      container.add(ASYNC_FACTORY);
      container.add(Server);

      const server = injector().invoke<any>(Server);
      expect(isPromise(server.asyncFactory)).toEqual(true);

      // WHEN
      await injector().load(container);

      expect(isPromise(server.asyncFactory)).toEqual(false);
      expect(server.asyncFactory.connection).toEqual(true);
    });
  });
});
