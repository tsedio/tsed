import {expect} from "chai";
import Sinon from "sinon";
import * as TypeORM from "typeorm";

import {createConnection} from "./createConnection";

describe("createConnection", () => {
  before(() => {
    Sinon.stub(TypeORM, "getConnectionManager");
  });

  after(() => {
    // @ts-ignore
    TypeORM.getConnectionManager.restore();
  });

  it("should create connection and return cache", async () => {
    // GIVEN
    const defaultConnection: any = {
      isConnected: true,
      connect: Sinon.stub().resolves()
    };
    const customConnection: any = {
      isConnected: true,
      connect: Sinon.stub().resolves()
    };

    let isDefaultConnectionCreated = false;
    let isCustomConnectionCreated = false;

    const connectionManager = {
      create: Sinon.stub().callsFake((opts: TypeORM.ConnectionOptions) => {
        if (opts.name == null || opts.name === "default") {
          isDefaultConnectionCreated = true;
          return defaultConnection;
        } else {
          isCustomConnectionCreated = true;
          return customConnection;
        }
      }),
      has: Sinon.stub().callsFake((name) => {
        if (name == null || name === "default") {
          return isDefaultConnectionCreated;
        } else {
          return isCustomConnectionCreated;
        }
      }),
      get: Sinon.stub().callsFake((name) => {
        if (name == null || name === "default") {
          return defaultConnection;
        } else {
          return customConnection;
        }
      }),
      connections: [defaultConnection, customConnection]
    };

    // @ts-ignore
    TypeORM.getConnectionManager.returns(connectionManager);

    // WHEN
    const result1 = await createConnection({name: "mydb", type: "mysql"});
    const result2 = await createConnection({name: "mydb", type: "mysql"});

    // THEN
    expect(result1).to.deep.eq(customConnection);
    expect(result2).to.deep.eq(customConnection);
    expect(connectionManager.create).to.have.been.calledOnce.and.calledWithExactly({name: "mydb", type: "mysql"});
    expect(defaultConnection.connect).to.have.not.been.called;
    expect(customConnection.connect).to.have.been.calledOnce;
  });
});
