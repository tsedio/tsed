import {Store} from "@tsed/core";

import {DITest, logger} from "../../node/index.js";
import {ProviderScope} from "../domain/ProviderScope.js";
import {ProviderType} from "../domain/ProviderType.js";
import {inject} from "./inject.js";
import {controller, injectable, interceptor} from "./injectable.js";

class Nested {
  get() {
    return "hello";
  }
}

class MyClass {
  nested = inject(Nested);
  logger = logger();
}

class MyController {}

injectable(Nested).scope(ProviderScope.SINGLETON).class(Nested);
injectable(MyClass);

describe("injectable", () => {
  describe("injectable()", () => {
    it("should define a singleton scope", async () => {
      const instance = await DITest.invoke(MyClass);

      expect(instance.nested).toBeInstanceOf(Nested);
      expect(instance.nested.get()).toEqual("hello");
    });
    it("should define class with scope", async () => {
      injectable(MyClass).scope(ProviderScope.SINGLETON).class(MyClass).store().set("test", "test");

      expect(Store.from(MyClass).get("test")).toEqual("test");
    });
    it("should create a factory", async () => {
      const builder = injectable(Symbol.for("Test")).factory(() => "test");
      const provider = builder.inspect();

      expect(provider.type).toEqual(ProviderType.PROVIDER);
      expect(builder.token()).toEqual(Symbol.for("Test"));
    });
    it("should create an async factory", async () => {
      const builder = injectable(Symbol.for("Test")).asyncFactory(() => Promise.resolve("test"));
      const provider = builder.inspect();

      expect(provider.type).toEqual(ProviderType.PROVIDER);
      expect(builder.token()).toEqual(Symbol.for("Test"));
    });
    it("should create a value", async () => {
      const builder = injectable(Symbol.for("Test")).value({
        test: "test"
      });
      const provider = builder.inspect();

      expect(provider.type).toEqual(ProviderType.VALUE);
      expect(builder.token()).toEqual(Symbol.for("Test"));
    });
  });

  describe("controller()", () => {
    it("should define a singleton scope", async () => {
      const builder = controller(MyController)
        .path("/my-controller")
        .scope(ProviderScope.REQUEST)
        .middlewares({
          use: [() => {}]
        });

      const provider = builder.inspect();

      expect(provider.type).toEqual(ProviderType.CONTROLLER);
      expect(provider.scope).toEqual(ProviderScope.REQUEST);
    });
  });

  describe("interceptor()", () => {
    it("should define a singleton scope", async () => {
      const builder = interceptor(MyController);
      const provider = builder.inspect();

      expect(provider.type).toEqual(ProviderType.INTERCEPTOR);
    });
  });
});
