import {EntityManagerCompat, MikroOrmEntityManagers} from "./MikroOrmEntityManagers";
import {EntityManager} from "@mikro-orm/core";
import {runInContext} from "@tsed/di";
import {PlatformTest} from "@tsed/common";
import {Logger} from "@tsed/logger";
import {anything, instance, mock, objectContaining, reset, verify, when} from "ts-mockito";

describe("MikroOrmEntityManagers", () => {
  const mockedEntityManager = mock<EntityManagerCompat>();
  const mockedLogger = mock<Logger>();

  let entityManager!: EntityManager;
  let store!: MikroOrmEntityManagers;

  beforeEach(async () => {
    entityManager = instance(mockedEntityManager);

    await PlatformTest.create({
      imports: [
        {
          token: Logger,
          use: instance(mockedLogger)
        }
      ]
    });

    store = PlatformTest.get<MikroOrmEntityManagers>(MikroOrmEntityManagers);
  });
  afterEach(() => {
    reset(mockedEntityManager);

    return PlatformTest.reset();
  });

  describe("get", () => {
    it("should return undefined if not such context", () => {
      // act
      const result = store.get("unknown");

      // assert
      expect(result).toBeUndefined();
    });

    it("should return entity manager if context is initialized", async () => {
      // arrange
      const ctx = PlatformTest.createRequestContext();

      when(mockedEntityManager.name).thenReturn("context1");
      when(mockedEntityManager.fork(anything(), anything())).thenReturn(entityManager);

      expect.assertions(1);

      await runInContext(ctx, () => {
        store.set(entityManager);

        // act
        const result = store.get("context1");

        // assert
        expect(result).toBe(entityManager);
      });
    });
  });

  describe("set", () => {
    it("should fork a entity manager", async () => {
      // arrange
      const ctx = PlatformTest.createRequestContext();

      when(mockedEntityManager.name).thenReturn("context1");
      when(mockedEntityManager.fork(anything(), anything())).thenReturn({} as unknown as EntityManager);

      // act
      await runInContext(ctx, () => store.set(instance(mockedEntityManager)));

      // assert
      verify(mockedEntityManager.fork(objectContaining({useContext: true}), true)).once();
    });

    it("should not fork a entity manager if context is not defined", async () => {
      // act
      await store.set(instance(mockedEntityManager));

      // assert
      verify(mockedEntityManager.fork(objectContaining({useContext: true}), true)).never();
    });
  });

  describe("has", () => {
    it("should return false if not such context", () => {
      // act
      const result = store.has("unknown");

      // assert
      expect(result).toBeFalsy();
    });

    it("should return true if context is initialized", async () => {
      // arrange
      const ctx = PlatformTest.createRequestContext();

      when(mockedEntityManager.name).thenReturn("context1");
      when(mockedEntityManager.fork(anything(), anything())).thenReturn(instance(entityManager));

      expect.assertions(1);

      await runInContext(ctx, () => {
        store.set(entityManager);

        // act
        const result = store.has("context1");

        // assert
        expect(result).toBe(true);
      });
    });
  });
});
