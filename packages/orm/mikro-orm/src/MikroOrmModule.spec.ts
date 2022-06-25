import {PlatformTest} from "@tsed/common";
import {EntityManager, MikroORM, Options} from "@mikro-orm/core";
import {MikroOrmRegistry} from "./services/MikroOrmRegistry";
import {anyFunction, anything, deepEqual, instance, mock, reset, verify, when} from "ts-mockito";
import {MikroOrmModule} from "./MikroOrmModule";
import {MikroOrmContext} from "./services/MikroOrmContext";
import {DIContext} from "@tsed/di";

describe("MikroOrmModule", () => {
  const config: Options = {
    type: "mongo",
    entities: [],
    clientUrl: "mongo://localhost"
  };
  const mockedMikroOrmRegistry = mock<MikroOrmRegistry>();
  const mockedMikroOrmContext = mock<MikroOrmContext>();
  const mockedMikroORM = mock<MikroORM>();
  const mockedEntityManager = mock<EntityManager>();
  const mockedDIContext = mock<DIContext>();

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
    jest.resetAllMocks();

    reset<MikroOrmRegistry | EntityManager | MikroORM | MikroOrmContext | DIContext>(
      mockedMikroOrmRegistry,
      mockedMikroOrmContext,
      mockedMikroORM,
      mockedEntityManager,
      mockedDIContext
    );

    return PlatformTest.reset();
  });

  describe("$onInit", () => {
    it("should register the corresponding instances", async () => {
      // arrange
      when(mockedMikroOrmRegistry.register(config)).thenResolve({} as unknown as MikroORM);

      // act
      await mikroOrmModule.$onInit();

      verify(mockedMikroOrmRegistry.register(deepEqual(config))).called();
    });
  });

  describe("$onDestroy", () => {
    it("should destroy the corresponding instances", async () => {
      // arrange
      when(mockedMikroOrmRegistry.clear()).thenResolve();

      // act
      await mikroOrmModule.$onDestroy();

      // assert
      verify(mockedMikroOrmRegistry.clear()).called();
    });
  });

  describe("$alterRunInContext", () => {
    it("should return a function", async () => {
      // arrange
      const next = jest.fn();
      const diContext = instance(mockedDIContext);

      // act
      const result = mikroOrmModule.$alterRunInContext(next, diContext);

      // assert
      expect(result).toBeInstanceOf(Function);
    });

    it("should make a function create a context", async () => {
      // arrange
      const next = jest.fn();
      const manager = instance(mockedEntityManager);
      const diContext = instance(mockedDIContext);

      when(mockedMikroOrmRegistry.values()).thenReturn([instance(mockedMikroORM)] as unknown as IterableIterator<MikroORM>);
      when(mockedMikroORM.em).thenReturn(manager);
      when(mockedMikroOrmContext.run(anything(), anything())).thenReturn();

      // act
      mikroOrmModule.$alterRunInContext(next, diContext)();

      // assert
      verify(mockedMikroOrmContext.run(deepEqual([manager]), next)).once();
    });
  });
});
