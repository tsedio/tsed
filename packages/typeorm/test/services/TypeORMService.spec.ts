import {TestContext} from "@tsed/testing";
import * as Sinon from "sinon";
import * as TypeORM from "typeorm";
import {TypeORMService} from "../../src";

describe("TypeORMService", () => {
  describe("createConnection()", () => {
    before(() => {
      Sinon.stub(TypeORM, "createConnection");
    });

    after(() => {
      TestContext.reset();
      // @ts-ignore
      TypeORM.createConnection.restore();
    });

    it("should create connection and close connection", async () => {
      // GIVEN
      const connection: any = {
        close: Sinon.stub()
      };

      // @ts-ignore
      TypeORM.createConnection.resolves(connection);

      const service = new TypeORMService();

      // WHEN
      const result1 = await service.createConnection("key", {config: "config"} as any);
      const result2 = await service.createConnection("key", {config: "config"} as any);

      // THEN
      result1.should.deep.eq(connection);
      result2.should.deep.eq(connection);
      TypeORM.createConnection.should.have.been.calledOnce.and.calledWithExactly({config: "config"});

      // WHEN close
      await service.closeConnections();

      // THEN
      connection.close.should.have.been.calledWithExactly();
    });
  });
});
