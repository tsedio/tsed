import {EntityManager, EventSubscriber, MikroORM, Options} from "@mikro-orm/core";
import {PlatformTest} from "@tsed/platform-http/testing";
import {anyOfClass, anything, deepEqual, instance, mock, reset, verify, when} from "ts-mockito";

import {Subscriber} from "./decorators/subscriber.js";
import {MikroOrmModule} from "./MikroOrmModule.js";
import {MikroOrmContext} from "./services/MikroOrmContext.js";
import {MikroOrmRegistry} from "./services/MikroOrmRegistry.js";

class Subscriber1 implements EventSubscriber {}

@Subscriber()
class Subscriber2 implements EventSubscriber {}

describe("MikroOrmModule", () => {
  const config: Options = {
    type: "mongo",
    entities: [],
    clientUrl: "mongo://localhost",
    subscribers: [new Subscriber1()]
  } as never;
  const mockedMikroOrmRegistry = mock<MikroOrmRegistry>();
  const mockedMikroOrmContext = mock<MikroOrmContext>();
  const mockedMikroORM = mock<MikroORM>();
  const mockedEntityManager = mock<EntityManager>();

  let mikroOrmModule!: MikroOrmModule;

  beforeEach(async () => {
    await PlatformTest.create({
      mikroOrm: [config],
      imports: [
        {
          token: MikroOrmContext,
          use: instance(mockedMikroOrmContext)
        },
        {
          token: MikroOrmRegistry,
          use: instance(mockedMikroOrmRegistry)
        }
      ]
    });

    mikroOrmModule = PlatformTest.get<MikroOrmModule>(MikroOrmModule);
  });

  afterEach(() => {
    vi.resetAllMocks();

    reset<MikroOrmRegistry | EntityManager | MikroORM | MikroOrmContext>(
      mockedMikroOrmRegistry,
      mockedMikroOrmContext,
      mockedMikroORM,
      mockedEntityManager
    );

    return PlatformTest.reset();
  });

  describe("$onInit", () => {
    it("should register the subscribers", async () => {
      // act
      await mikroOrmModule.$onInit();

      // assert
      verify(
        mockedMikroOrmRegistry.register(deepEqual({...config, subscribers: [anyOfClass(Subscriber1), anyOfClass(Subscriber2)]}))
      ).called();
    });
  });

  describe("$onDestroy", () => {
    it("should destroy the corresponding instances", async () => {
      // act
      await mikroOrmModule.$onDestroy();

      // assert
      verify(mockedMikroOrmRegistry.clear()).called();
    });
  });

  describe("$alterRunInContext", () => {
    it("should return a function", () => {
      // arrange
      const next = vi.fn();

      // act
      const result = mikroOrmModule.$alterRunInContext(next);

      // assert
      expect(result).toBeInstanceOf(Function);
    });

    it("should make a function create a context", () => {
      // arrange
      const next = vi.fn();
      const manager = instance(mockedEntityManager);

      when(mockedMikroOrmRegistry.values()).thenReturn([instance(mockedMikroORM)] as unknown as IterableIterator<MikroORM>);
      when(mockedMikroORM.em).thenReturn(manager);
      when(mockedMikroOrmContext.run(anything(), anything())).thenReturn();

      // act
      mikroOrmModule.$alterRunInContext(next)();

      // assert
      verify(mockedMikroOrmContext.run(deepEqual([manager]), next)).once();
    });
  });
});
