import {descriptorOf} from "@tsed/core";
import {registerProvider} from "../registries/ProviderRegistry";
import {InjectorService} from "../services/InjectorService";
import {Inject} from "./inject";
import {Injectable} from "./injectable";

describe("@Inject()", () => {
  describe("used on unsupported decorator type", () => {
    it("should store metadata", () => {
      // GIVEN
      class Test {
        test() {}
      }

      // WHEN
      let actualError;
      try {
        Inject()(Test, "test", descriptorOf(Test, "test"));
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError.message).toEqual("Inject cannot be used as method.static decorator on Test.test");
    });
  });

  describe("@property", () => {
    it("should inject service", async () => {
      // GIVEN
      @Injectable()
      class Test {
        @Inject()
        test: InjectorService;
      }

      const injector = new InjectorService();
      const instance = await injector.invoke<Test>(Test);

      expect(instance).toBeInstanceOf(Test);
      expect(instance.test).toBeInstanceOf(InjectorService);
    });
    it("should inject service w/ async factory", async () => {
      // GIVEN
      class Test {
        constructor(public type: string) {}
      }

      const TokenAsync = Symbol.for("MyService");

      registerProvider<Test>({
        provide: TokenAsync,
        type: "test:async",
        deps: [],
        useAsyncFactory() {
          return Promise.resolve(new Test("async"));
        }
      });

      @Injectable()
      class Parent1 {
        @Inject(TokenAsync)
        test: Test;
      }

      @Injectable()
      class Parent2 {
        @Inject(TokenAsync)
        test: Test;
      }

      const injector = new InjectorService();

      await injector.load();

      const parent1 = await injector.invoke<Parent1>(Parent1);
      const parent2 = await injector.invoke<Parent2>(Parent2);

      expect(parent1.test).toBeInstanceOf(Test);
      expect(parent2.test).toBeInstanceOf(Test);
    });
    it("should inject service with the given type", async () => {
      // GIVEN
      @Injectable()
      class Test {
        @Inject(InjectorService, (bean: any) => bean.get(InjectorService))
        test: InjectorService;
      }

      const injector = new InjectorService();
      const instance = await injector.invoke<Test>(Test);

      expect(instance).toBeInstanceOf(Test);
      expect(instance.test).toBeInstanceOf(InjectorService);
    });
    it("should inject many services", async () => {
      const TOKEN_GROUPS = Symbol.for("groups:1");

      interface InterfaceGroup {
        type: string;
      }

      @Injectable({
        type: TOKEN_GROUPS
      })
      class MyService1 implements InterfaceGroup {
        readonly type: string = "service1";

        constructor(@Inject(InjectorService) readonly injector: any) {}
      }

      @Injectable({
        type: TOKEN_GROUPS
      })
      class MyService2 implements InterfaceGroup {
        readonly type: string = "service2";

        constructor(@Inject(InjectorService) readonly injector: any) {}
      }

      const TokenAsync = Symbol.for("MyService2");

      registerProvider({
        provide: TokenAsync,
        type: TOKEN_GROUPS,
        deps: [],
        useAsyncFactory() {
          return Promise.resolve({
            type: "async"
          });
        }
      });

      @Injectable()
      class MyInjectable {
        @Inject(TOKEN_GROUPS)
        instances: InterfaceGroup[];
      }

      const injector = new InjectorService();

      await injector.load();

      const instance = await injector.invoke<MyInjectable>(MyInjectable);

      expect(instance.instances).toBeInstanceOf(Array);
      expect(instance.instances).toHaveLength(3);
      expect(instance.instances[0].type).toEqual("service1");
      expect(instance.instances[1].type).toEqual("service2");
      expect(instance.instances[2].type).toEqual("async");
    });
    it("should throw error", () => {
      try {
        // GIVEN
        @Injectable()
        class Test {
          @Inject()
          test: Object;
        }
      } catch (er) {
        expect(er.message).toContain("Object isn't a valid token. Please check the token set on Test.test");
      }
    });
  });

  describe("@constructorParameters", () => {
    describe("when token is given on constructor", () => {
      it("should inject the expected provider", async () => {
        @Injectable()
        class MyInjectable {
          constructor(@Inject(InjectorService) readonly injector: InjectorService) {}
        }

        const injector = new InjectorService();
        const instance = await injector.invoke<MyInjectable>(MyInjectable);

        expect(instance.injector).toBeInstanceOf(InjectorService);
      });
    });

    describe("when a group token is given on constructor", () => {
      it("should inject the expected provider", async () => {
        const TOKEN_GROUPS = Symbol.for("groups:2");

        interface InterfaceGroup {
          type: string;
        }

        @Injectable({
          type: TOKEN_GROUPS
        })
        class MyService1 implements InterfaceGroup {
          readonly type: string = "service1";

          constructor(@Inject(InjectorService) readonly injector: InjectorService) {}
        }

        @Injectable({
          type: TOKEN_GROUPS
        })
        class MyService2 implements InterfaceGroup {
          readonly type: string = "service2";

          constructor(@Inject(InjectorService) readonly injector: InjectorService) {}
        }

        const TokenAsync = Symbol.for("MyService1");

        registerProvider({
          provide: TokenAsync,
          type: TOKEN_GROUPS,
          deps: [],
          useAsyncFactory() {
            return Promise.resolve({
              type: "async"
            });
          }
        });

        @Injectable()
        class MyInjectable {
          constructor(@Inject(TOKEN_GROUPS) readonly instances: InterfaceGroup[]) {}
        }

        const injector = new InjectorService();

        await injector.load();

        const instance = await injector.invoke<MyInjectable>(MyInjectable);

        expect(instance.instances).toBeInstanceOf(Array);
        expect(instance.instances).toHaveLength(3);
        expect(instance.instances[0].type).toEqual("service1");
        expect(instance.instances[1].type).toEqual("service2");
        expect(instance.instances[2].type).toEqual("async");
      });
    });
  });
});
