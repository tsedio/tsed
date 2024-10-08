import {beforeEach} from "vitest";

import {DITest} from "../../node/index.js";
import {Injectable} from "../decorators/injectable.js";
import {registerProvider} from "../registries/ProviderRegistry.js";
import {$alter, $alterAsync, $emit} from "./events.js";
import {injector} from "./injector.js";

@Injectable()
class Test {
  $event(value: any) {}

  $alterValue(value: any) {
    return "alteredValue";
  }

  $alterAsyncValue(value: any) {
    return Promise.resolve("alteredValue");
  }
}

describe("events", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  describe("$emit()", () => {
    it("should alter value", async () => {
      // GIVEN
      const service = DITest.get<Test>(Test);

      vi.spyOn(service, "$event");

      await $emit("$event", "value");

      expect(service.$event).toHaveBeenCalledWith("value");
    });
    it("should alter value (factory)", () => {
      registerProvider({
        provide: "TOKEN",
        useFactory: () => {
          return {};
        },
        hooks: {
          $alterValue(instance: any, value: any) {
            return "alteredValue";
          }
        }
      });

      // GIVEN
      injector().invoke<any>("TOKEN");

      const value = $alter("$alterValue", "value");

      expect(value).toEqual("alteredValue");
    });
  });
  describe("$alter()", () => {
    it("should alter value", async () => {
      // GIVEN
      const service = await DITest.invoke<Test>(Test);
      vi.spyOn(service, "$alterValue");

      const value = $alter("$alterValue", "value");

      expect(service.$alterValue).toHaveBeenCalledWith("value");
      expect(value).toEqual("alteredValue");
    });
    it("should alter value (factory)", () => {
      registerProvider({
        provide: "TOKEN",
        useFactory: () => {
          return {};
        },
        hooks: {
          $alterValue(instance: any, value: any) {
            return "alteredValue";
          }
        }
      });

      // GIVEN
      injector().invoke<any>("TOKEN");

      const value = $alter("$alterValue", "value");

      expect(value).toEqual("alteredValue");
    });
  });
  describe("$alterAsync()", () => {
    it("should alter value", async () => {
      const service = await DITest.invoke<Test>(Test)!;

      vi.spyOn(service, "$alterAsyncValue");

      const value = await $alterAsync("$alterAsyncValue", "value");

      expect(service.$alterAsyncValue).toHaveBeenCalledWith("value");
      expect(value).toEqual("alteredValue");
    });
  });
});
