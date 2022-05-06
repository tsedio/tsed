import {PlatformTest} from "@tsed/common";
import {getConnectionManager} from "typeorm";
import {TypeORMService} from "../index";

jest.mock("typeorm");

function getConnectionFixture() {
  const service = PlatformTest.get<TypeORMService>(TypeORMService);

  return {
    service
  };
}

class FakeConnectionManager extends Map<string, any> {
  get connections() {
    return [...this.values()];
  }

  create(connectionOptions: any) {
    connectionOptions = {
      ...connectionOptions,
      connect: jest.fn().mockImplementation(() => {
        connectionOptions.isConnected = true;
      }),
      close: jest.fn().mockImplementation(() => {
        connectionOptions.isConnected = false;
      }),
      isConnected: false
    };
    this.set(connectionOptions.name, connectionOptions);
  }
}

describe("TypeORMService", () => {
  const connectionManager = new FakeConnectionManager();
  beforeEach(() => {
    (getConnectionManager as jest.Mock).mockReturnValue(connectionManager);
  });
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("createConnection()", () => {
    it("should create connection and close connection", async () => {
      const {service} = getConnectionFixture();
      // GIVEN

      // WHEN
      const result1 = await service.createConnection({name: "mydb", config: "config"} as any);
      const result2 = await service.createConnection({name: "mydb", config: "config"} as any);
      const result3 = await service.createConnection({config: "config"} as any);
      const result4 = await service.createConnection({config: "config"} as any);

      // THEN
      expect(result1).toEqual(service.get("mydb"));
      expect(result2).toEqual(service.get("mydb"));
      expect(result3).toEqual(service.get("default"));
      expect(result4).toEqual(service.get());
      expect(service.has("default")).toEqual(true);
      expect(service.has("default1")).toEqual(false);

      // WHEN close
      await service.closeConnections();
    });
  });
});
