import {PlatformApplication, PlatformTest} from "@tsed/common";
import {EntityManager, MikroORM, Options} from "@mikro-orm/core";
import {MikroOrmRegistry} from "./services/MikroOrmRegistry";
import {anyFunction, anything, deepEqual, instance, mock, reset, verify, when} from "ts-mockito";
import {MikroOrmModule} from "./MikroOrmModule";
import {MikroOrmContext} from "./services/MikroOrmContext";

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

  let mikroOrmModule!: MikroOrmModule;
  let spiedUseMethod!: jest.SpyInstance;

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
    const app = PlatformTest.get<PlatformApplication>(PlatformApplication);

    spiedUseMethod = jest.spyOn(app, "use");
  });

  afterEach(() => {
    jest.resetAllMocks();

    reset<MikroOrmRegistry | EntityManager | MikroORM | MikroOrmContext>(
      mockedMikroOrmRegistry,
      mockedMikroOrmContext,
      mockedMikroORM,
      mockedEntityManager
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

  describe("$beforeRoutesInit", () => {
    it("should register a raw middleware", async () => {
      // act
      await mikroOrmModule.$beforeRoutesInit();

      // assert
      expect(spiedUseMethod).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should make a middleware create a context", async () => {
      // arrange
      const mockedNext = jest.fn();
      const manager = instance(mockedEntityManager);

      when(mockedMikroOrmRegistry.values()).thenReturn([instance(mockedMikroORM)] as unknown as IterableIterator<MikroORM>);
      when(mockedMikroORM.em).thenReturn(manager);
      when(mockedMikroOrmContext.run(anything(), anything())).thenReturn();
      spiedUseMethod.mockImplementation((callback) => callback(undefined, undefined, mockedNext));

      // act
      await mikroOrmModule.$beforeRoutesInit();

      // assert
      expect(spiedUseMethod).toHaveBeenCalled();
      verify(mockedMikroOrmContext.run(deepEqual([manager]), anyFunction())).once();
    });
  });
});
