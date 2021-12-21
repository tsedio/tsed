import {PlatformTest} from "@tsed/common";
import {Options} from "@mikro-orm/core";
import {MikroOrmRegistry} from "./services";
import {MikroOrmModule} from "./MikroOrmModule";

describe("MikroOrmModule", () => {
  const config: Options = {
    type: "mongo",
    entities: [],
    clientUrl: "mongo://localhost"
  };

  beforeEach(() =>
    PlatformTest.create({
      mikroOrm: [config],
      imports: [
        {
          token: MikroOrmRegistry,
          use: {
            createConnection: jest.fn(),
            closeConnections: jest.fn()
          }
        }
      ]
    })
  );

  afterEach(() => {
    return PlatformTest.reset();
  });

  describe("$onInit", () => {
    it("should create the corresponding connections", async () => {
      const mikroOrmRegistry = PlatformTest.get<MikroOrmRegistry>(MikroOrmRegistry);

      expect(mikroOrmRegistry.createConnection).toHaveBeenCalledWith(config);
    });
  });

  describe("$onDestroy", () => {
    it("should destroy the corresponding connections", async () => {
      // arrange
      const mikroOrmRegistry = PlatformTest.get<MikroOrmRegistry>(MikroOrmRegistry);
      const mikroOrmModule = PlatformTest.get<MikroOrmModule>(MikroOrmModule);

      // act
      await mikroOrmModule.$onDestroy();

      // assert
      expect(mikroOrmRegistry.closeConnections).toHaveBeenCalledWith();
    });
  });
});
