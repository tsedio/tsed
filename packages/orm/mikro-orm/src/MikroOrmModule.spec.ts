import {PlatformTest} from "@tsed/common";
import {MikroORM, Options} from "@mikro-orm/core";
import {MikroOrmRegistry} from "./services";
import {deepEqual, instance, mock, reset, verify, when} from "ts-mockito";
import {MikroOrmModule} from "./MikroOrmModule";

describe("MikroOrmModule", () => {
  const config: Options = {
    type: "mongo",
    entities: [],
    clientUrl: "mongo://localhost"
  };
  const mockMikroOrmRegistry = mock<MikroOrmRegistry>();

  beforeEach(() =>
    PlatformTest.create({
      mikroOrm: [config],
      imports: [
        {
          token: MikroOrmRegistry,
          use: instance(mockMikroOrmRegistry)
        }
      ]
    })
  );

  afterEach(() => {
    reset(mockMikroOrmRegistry);

    return PlatformTest.reset();
  });

  describe("$onInit", () => {
    it("should create the corresponding connections", async () => {
      // arrange
      const mikroOrmModule = PlatformTest.get<MikroOrmModule>(MikroOrmModule);
      when(mockMikroOrmRegistry.createConnection(config)).thenResolve(({} as unknown) as MikroORM);

      // act
      await mikroOrmModule.$onInit();

      verify(mockMikroOrmRegistry.createConnection(deepEqual(config))).called();
    });
  });

  describe("$onDestroy", () => {
    it("should destroy the corresponding connections", async () => {
      // arrange
      const mikroOrmModule = PlatformTest.get<MikroOrmModule>(MikroOrmModule);
      when(mockMikroOrmRegistry.closeConnections()).thenResolve();

      // act
      await mikroOrmModule.$onDestroy();

      // assert
      verify(mockMikroOrmRegistry.closeConnections()).called();
    });
  });
});
