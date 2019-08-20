import {TestContext} from "@tsed/testing";
import * as Sinon from "sinon";
import * as TypeORM from "typeorm";
import {getConnectionManager} from "typeorm";
import {TypeORMService} from "../../src";

describe("TypeORMService", () => {
  describe("createConnection()", () => {
    before(() => {
      Sinon.stub(TypeORM, "getConnectionManager");
    });

    after(() => {
      TestContext.reset();
      // @ts-ignore
      TypeORM.getConnectionManager.restore();
    });

    it("should create connection and close connection", async () => {
      // GIVEN
      const connection: any = {
        connect: Sinon.stub().resolves(),
        close: Sinon.stub()
      };
      let called = false;
      const connectionManager = {
        create: Sinon.stub().returns(connection),
        has: Sinon.stub().callsFake((id) => {
          if (called) {
            return true;
          }
          called = true;

          return false;
        }),
        get: Sinon.stub().returns(connection),
        connections: [connection]
      };

      // @ts-ignore
      TypeORM.getConnectionManager.returns(connectionManager);

      const service = new TypeORMService();

      // WHEN
      const result1 = await service.createConnection("key", {config: "config"} as any);
      const result2 = await service.createConnection("key", {config: "config"} as any);

      // THEN
      result1.should.deep.eq(connection);
      result2.should.deep.eq(connection);
      connectionManager.create.should.have.been.calledOnce.and.calledWithExactly({config: "config"});

      // WHEN close
      await service.closeConnections();

      // THEN
      connection.close.should.have.been.calledWithExactly();
    });
  });
});
