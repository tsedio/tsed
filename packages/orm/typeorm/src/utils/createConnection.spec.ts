import {ConnectionManager, getConnectionManager} from "typeorm";
import * as Connection from "typeorm/connection/Connection";
import {createConnection} from "./createConnection.js";

vi.mock("typeorm", async (importOriginal) => {
  const mod = await importOriginal<any>();
  return {
    ...mod,
    getConnectionManager: vi.fn()
  };
});

function getConnectionFixture() {
  const defaultConnection: any = {
    name: "default",
    isConnected: true,
    connect: vi.fn().mockResolvedValue(undefined),
    close: vi.fn()
  };
  const customConnection: any = {
    isConnected: true,
    connect: vi.fn().mockResolvedValue(undefined),
    close: vi.fn()
  };

  // create ConnectionManager
  const connectionManager = new ConnectionManager();
  const connectionManagerCreateSpy = vi.spyOn(connectionManager, "create");

  // replace
  (getConnectionManager as any).mockReturnValue(connectionManager);

  // replace Connection constructor
  const connectionStub = vi.spyOn(Connection, "Connection").mockImplementation((opts) => {
    if (opts.name == null || opts.name === "default") {
      return defaultConnection;
    } else {
      customConnection.name = opts.name;
      return customConnection;
    }
  });

  return {
    connectionManager,
    connectionManagerCreateSpy,
    connectionStub,
    defaultConnection,
    customConnection
  };
}

describe("createConnection", () => {
  it("should create connection and return cache", async () => {
    // GIVEN
    const {customConnection, connectionManagerCreateSpy, defaultConnection} = getConnectionFixture();

    // WHEN
    const result1 = await createConnection({name: "mydb", type: "mysql"});
    const result2 = await createConnection({name: "mydb", type: "mysql"});

    // THEN
    expect(result1).toEqual(customConnection);
    expect(result2).toEqual(customConnection);
    expect(connectionManagerCreateSpy).toHaveBeenCalledWith({name: "mydb", type: "mysql"});
    expect(defaultConnection.connect).not.toHaveBeenCalled();
  });
});
