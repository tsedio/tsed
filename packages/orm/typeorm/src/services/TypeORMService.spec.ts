import {ConnectionManager, getConnectionManager} from "typeorm";
import * as Connection from "typeorm/connection/Connection";
import {TypeORMService} from "../index";

jest.mock("typeorm", () => {
  return {
    ...jest.requireActual("typeorm"),
    getConnectionManager: jest.fn()
  };
});

function getConnectionFixture() {
  const defaultConnection: any = {
    name: "default",
    isConnected: true,
    connect: jest.fn().mockResolvedValue(undefined),
    close: jest.fn()
  };
  const customConnection: any = {
    isConnected: true,
    connect: jest.fn().mockResolvedValue(undefined),
    close: jest.fn()
  };

  // create ConnectionManager
  const connectionManager = new ConnectionManager();
  const connectionManagerCreateSpy = jest.spyOn(connectionManager, "create");

  // replace
  (getConnectionManager as any).mockReturnValue(connectionManager);

  // replace Connection constructor
  const connectionStub = jest.spyOn(Connection, "Connection").mockImplementation((opts) => {
    if (opts.name == null || opts.name === "default") {
      return defaultConnection;
    } else {
      customConnection.name = opts.name;
      return customConnection;
    }
  });

  return {connectionManager, connectionManagerCreateSpy, connectionStub, defaultConnection, customConnection};
}

describe("TypeORMService", () => {
  describe("createConnection()", () => {
    it("should create connection and close connection", async () => {
      const {connectionManagerCreateSpy, defaultConnection, customConnection} = getConnectionFixture();
      // GIVEN
      const service = new TypeORMService();
      // @ts-ignore
      service.injector = {
        logger: {
          info: jest.fn(),
          error: jest.fn(),
          debug: jest.fn()
        }
      } as any;

      // WHEN
      const result1 = await service.createConnection({name: "mydb", config: "config"} as any);
      const result2 = await service.createConnection({name: "mydb", config: "config"} as any);
      const result3 = await service.createConnection({config: "config"} as any);
      const result4 = await service.createConnection({config: "config"} as any);

      // // THEN
      expect(result1).toEqual(customConnection);
      expect(result2).toEqual(customConnection);
      expect(result3).toEqual(defaultConnection);
      expect(result4).toEqual(defaultConnection);
      expect(connectionManagerCreateSpy).toHaveBeenCalledTimes(2);
      expect(connectionManagerCreateSpy).toHaveBeenCalledWith({name: "mydb", config: "config"});
      expect(connectionManagerCreateSpy).toHaveBeenCalledWith({name: "default", config: "config"});

      // WHEN close
      await service.closeConnections();

      // THEN
      expect(defaultConnection.close).toHaveBeenCalledWith();
      expect(customConnection.close).toHaveBeenCalledWith();
    });
  });

  describe("get()", () => {
    it("should return corresponded connections", async () => {
      const {connectionManager, defaultConnection, customConnection} = getConnectionFixture();

      // GIVEN
      const service = new TypeORMService();

      // WHEN
      await connectionManager.create({config: "config"} as any);
      await connectionManager.create({name: "mydb", config: "config"} as any);
      const result1 = service.get();
      const result2 = service.get("default");
      const result3 = service.get("mydb");

      // THEN
      expect(result1).toEqual(defaultConnection);
      expect(result2).toEqual(defaultConnection);
      expect(result3).toEqual(customConnection);
    });
  });

  describe("has()", () => {
    it("should return corresponded connections existence", async () => {
      const {connectionManager} = getConnectionFixture();

      // GIVEN
      const service = new TypeORMService();

      // THEN
      expect(service.has()).toBe(false);
      expect(service.has("default")).toBe(false);
      expect(service.has("mydb")).toBe(false);

      // WHEN
      await connectionManager.create({name: "mydb", config: "config"} as any);

      // THEN
      expect(service.has()).toBe(false);
      expect(service.has("default")).toBe(false);
      expect(service.has("mydb")).toBe(true);

      // WHEN
      await connectionManager.create({config: "config"} as any);

      // THEN
      expect(service.has()).toBe(true);
      expect(service.has("default")).toBe(true);
      expect(service.has("mydb")).toBe(true);
    });
  });
});
