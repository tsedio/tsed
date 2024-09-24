import {catchAsyncError, catchError} from "@tsed/core";

import {DITest} from "../../node/index.js";
import {registerProvider} from "../registries/ProviderRegistry.js";
import {InjectorService} from "../services/InjectorService.js";
import {Inject, inject} from "./inject.js";
import {Injectable} from "./injectable.js";

describe("inject", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());
  describe("inject()", () => {
    describe("when inject function is used on a property", () => {
      it("should inject the expected provider", async () => {
        class Nested {}

        class Test {
          readonly injector = inject(InjectorService);
          readonly nested = inject(Nested);

          constructor() {
            expect(this.injector).toBeInstanceOf(InjectorService);
            expect(this.nested).not.toBeInstanceOf(Nested);
          }
        }

        await DITest.invoke(Test, [
          {
            token: Nested,
            use: {}
          }
        ]);
      });
    });
  });
  describe("@Inject()", () => {
    describe("when the decorator used on property", () => {
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
      it("should inject service and async factory", async () => {
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
      it("should inject service and use onGet option to transform injected service", async () => {
        // GIVEN
        @Injectable()
        class Test {
          @Inject(InjectorService, {transform: (instance) => instance.get(InjectorService)})
          test: InjectorService;
        }

        const injector = new InjectorService();
        const instance = await injector.invoke<Test>(Test);

        expect(instance).toBeInstanceOf(Test);
        expect(instance.test).toBeInstanceOf(InjectorService);
      });
      it("should inject service and use onGet option to transform injected service (legacy)", async () => {
        // GIVEN
        @Injectable()
        class Test {
          @Inject(InjectorService, (instance) => instance.get(InjectorService))
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
      it("should inject service and use mock", async () => {
        @Injectable()
        class Nested {
          get cache() {
            return true;
          }
        }

        @Injectable()
        class Test {
          @Inject()
          nested: Nested;
        }

        const instance = await DITest.invoke(Test, [
          {
            token: Nested,
            use: {
              cache: false
            }
          }
        ]);

        expect(instance.nested.cache).toEqual(false);

        const instance2 = await DITest.invoke(Test, []);
        expect(instance2.nested.cache).toEqual(true);
      });
    });
    describe("when the decorator is used on constructor parameter", () => {
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
    describe("when token is Object", () => {
      it("should throw error", async () => {
        class Test {
          @Inject()
          test: any;
        }

        const error = await catchAsyncError(async () => {
          const instance = await DITest.invoke(Test);

          return instance.test;
        });

        expect(error?.message).toContain("Object isn't a valid token. Please check the token set on Test.test");
      });
    });
  });
});
