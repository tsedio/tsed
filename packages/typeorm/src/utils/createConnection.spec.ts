import {expect} from "chai";
import Sinon, {spy, stub, SinonSpy, SinonStub} from "sinon";
import * as TypeORM from "typeorm";
import {ConnectionManager} from "typeorm";
import * as Connection from "typeorm/connection/Connection";

import {createConnection} from "./createConnection";

describe("createConnection", () => {
  let connectionManager: ConnectionManager;
  let connectionManagerCreateSpy: SinonSpy;

  let getConnectionManagerStub: SinonStub;
  let connectionStub: SinonStub;

  const defaultConnection: any = {
    name: "default",
    isConnected: true,
    connect: stub().resolves(),
    close: stub()
  };
  const customConnection: any = {
    isConnected: true,
    connect: stub().resolves(),
    close: stub()
  };

  beforeEach(() => {
    // create ConnectionManager
    connectionManager = new ConnectionManager();
    connectionManagerCreateSpy = spy(connectionManager, "create");
    // replace
    getConnectionManagerStub = stub(TypeORM, "getConnectionManager").returns(connectionManager);

    // replace Connection constructor
    connectionStub = stub(Connection, "Connection").callsFake((opts) => {
      if (opts.name == null || opts.name === "default") {
        return defaultConnection;
      } else {
        customConnection.name = opts.name;
        return customConnection;
      }
    });
  });

  afterEach(() => {
    getConnectionManagerStub.restore();
    connectionStub.restore();
  });

  it("should create connection and return cache", async () => {
    // GIVEN

    // WHEN
    const result1 = await createConnection({name: "mydb", type: "mysql"});
    const result2 = await createConnection({name: "mydb", type: "mysql"});

    // THEN
    expect(result1).to.deep.eq(customConnection);
    expect(result2).to.deep.eq(customConnection);
    expect(connectionManagerCreateSpy).calledOnce.and.calledWithExactly({name: "mydb", type: "mysql"});
    expect(defaultConnection.connect).to.have.not.been.called;
    expect(customConnection.connect).to.have.been.calledOnce;
  });
});
