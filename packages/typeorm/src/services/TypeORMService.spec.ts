import {expect} from "chai";
import {PlatformTest} from "@tsed/common";
import * as Sinon from "sinon";
import * as TypeORM from "typeorm";
import {TypeORMService} from "../index";

describe("TypeORMService", () => {
  describe("createConnection()", () => {
    before(() => {
      Sinon.stub(TypeORM, "getConnectionManager");
    });

    after(() => {
      PlatformTest.reset();
      // @ts-ignore
      TypeORM.getConnectionManager.restore();
    });

    it("should create connection and close connection", async () => {
      // GIVEN
      const connection: any = {
        isConnected: true,
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
      // @ts-ignore
      service.injector = {
        logger: {
          info: Sinon.stub(),
          error: Sinon.stub(),
          debug: Sinon.stub()
        }
      } as any;

      // WHEN
      const result1 = await service.createConnection("key", {config: "config"} as any);
      const result2 = await service.createConnection("key", {config: "config"} as any);

      // THEN
      expect(result1).to.deep.eq(connection);
      expect(result2).to.deep.eq(connection);
      expect(connectionManager.create).to.have.been.calledOnce.and.calledWithExactly({config: "config", name: "key"});

      // WHEN close
      await service.closeConnections();

      // THEN
      expect(connection.close).to.have.been.calledWithExactly();
    });
  });
});
