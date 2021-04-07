import {expect} from "chai";
import {PlatformTest} from "@tsed/common";
import Sinon from "sinon";
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
      const defaultConnection: any = {
        isConnected: true,
        connect: Sinon.stub().resolves(),
        close: Sinon.stub()
      };
      const customConnection: any = {
        isConnected: true,
        connect: Sinon.stub().resolves(),
        close: Sinon.stub()
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
      const result1 = await service.createConnection({name: "mydb", config: "config"} as any);
      const result2 = await service.createConnection({name: "mydb", config: "config"} as any);
      const result3 = await service.createConnection({config: "config"} as any);
      const result4 = await service.createConnection({config: "config"} as any);

      // // THEN
      expect(result1).to.deep.eq(customConnection);
      expect(result2).to.deep.eq(customConnection);
      expect(result3).to.deep.eq(defaultConnection);
      expect(result4).to.deep.eq(defaultConnection);
      expect(connectionManager.create).to.have.been.calledTwice;
      expect(connectionManager.create).calledWithExactly({name: "mydb", config: "config"});
      expect(connectionManager.create).calledWithExactly({name: "default", config: "config"});

      // WHEN close
      await service.closeConnections();

      // THEN
      expect(defaultConnection.close).to.have.been.calledWithExactly();
      expect(customConnection.close).to.have.been.calledWithExactly();
    });
  });

  describe("get()", () => {
    before(() => {
      Sinon.stub(TypeORM, "getConnectionManager");
    });

    after(() => {
      PlatformTest.reset();
      // @ts-ignore
      TypeORM.getConnectionManager.restore();
    });

    it("should return corresponded connections", async () => {
      // GIVEN
      const defaultConnection = {name: "default"};
      const customConnection = {name: "custom"};
      const connectionManager = {
        get: Sinon.stub().callsFake((name) => {
          if (name == null || name === "default") {
            return defaultConnection;
          } else if (name === "custom") {
            return customConnection;
          }
          return null;
        })
      };

      // @ts-ignore
      TypeORM.getConnectionManager.returns(connectionManager);

      const service = new TypeORMService();

      // WHEN
      const result1 = service.get();
      const result2 = service.get("default");
      const result3 = service.get("custom");

      // THEN
      expect(result1).to.deep.eq(defaultConnection);
      expect(result2).to.deep.eq(defaultConnection);
      expect(result3).to.deep.eq(customConnection);
    });
  });
});
