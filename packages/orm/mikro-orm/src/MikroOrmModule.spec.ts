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
    it("should register the corresponding instances", async () => {
      // arrange
      const mikroOrmModule = PlatformTest.get<MikroOrmModule>(MikroOrmModule);
      when(mockMikroOrmRegistry.register(config)).thenResolve({} as unknown as MikroORM);

      // act
      await mikroOrmModule.$onInit();

      verify(mockMikroOrmRegistry.register(deepEqual(config))).called();
    });
  });

  describe("$onDestroy", () => {
    it("should destroy the corresponding instances", async () => {
      // arrange
      const mikroOrmModule = PlatformTest.get<MikroOrmModule>(MikroOrmModule);
      when(mockMikroOrmRegistry.clear()).thenResolve();

      // act
      await mikroOrmModule.$onDestroy();

      // assert
      verify(mockMikroOrmRegistry.clear()).called();
    });
  });
});
