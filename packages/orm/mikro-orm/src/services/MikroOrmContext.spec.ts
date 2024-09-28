import {EntityManager, RequestContext} from "@mikro-orm/core";
import {deepEqual, instance as originalInstance, mock, reset, spy, verify, when} from "ts-mockito";

import {MikroOrmContext} from "./MikroOrmContext.js";

const instance = <T extends object>(m: T): T =>
  new Proxy<T>(originalInstance(m), {
    get(target, prop, receiver) {
      if (["Symbol(Symbol.toPrimitive)", "Symbol(Symbol.isConcatSpreadable)", "length"].includes(prop.toString())) {
        return undefined;
      }
      return Reflect.get(target, prop, receiver);
    }
  });

describe("MikroOrmContext", () => {
  const mockedEntityManager = mock<EntityManager>();

  let spiedRequestContext: typeof RequestContext;
  let entityManager!: EntityManager;
  let context!: MikroOrmContext;

  beforeEach(() => {
    spiedRequestContext = spy(RequestContext);
    entityManager = instance(mockedEntityManager);
    context = new MikroOrmContext();
  });
  afterEach(() => reset<typeof RequestContext | EntityManager>(mockedEntityManager, spiedRequestContext));

  describe("get", () => {
    it("should return undefined if not such context", () => {
      // act
      const result = context.get("unknown");

      // assert
      expect(result).toBeUndefined();
    });

    it("should return entity manager if context is initialized", () => {
      // arrange
      when(spiedRequestContext.getEntityManager("context1")).thenReturn(entityManager);

      // act
      const result = context.get("context1");

      // assert
      expect(result).toBe(entityManager);
    });
  });

  describe("wrap", () => {
    it("should run a function within a mikro-orm context", async () => {
      // arrange
      const task = vi.fn();

      // act
      await context.run([entityManager], task);

      // assert
      verify(spiedRequestContext.create(deepEqual([entityManager]), task)).once();
    });

    it("should return a result of function execution", async () => {
      // arrange
      const task = vi.fn().mockResolvedValue("string");

      // act
      const result = await context.run([entityManager], task);

      // assert
      expect(result).toEqual("string");
    });
  });

  describe("has", () => {
    it("should return false if not such context", () => {
      // act
      const result = context.has("unknown");

      // assert
      expect(result).toBeFalsy();
    });

    it("should return true if context is initialized", () => {
      // arrange
      when(spiedRequestContext.getEntityManager("context1")).thenReturn(entityManager);

      // act
      const result = context.has("context1");

      // assert
      expect(result).toBe(true);
    });
  });
});
