import {expect} from "chai";
import Sinon, {spy, stub, SinonSpy, SinonStub} from "sinon";
import * as TypeORM from "typeorm";
import {ConnectionManager} from "typeorm";
import * as Connection from "typeorm/connection/Connection";
import {TypeORMService} from "../index";

describe("TypeORMService", () => {
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

  describe("createConnection()", () => {
    it("should create connection and close connection", async () => {
      // GIVEN
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
      expect(connectionManagerCreateSpy).calledTwice;
      expect(connectionManagerCreateSpy).calledWithExactly({name: "mydb", config: "config"});
      expect(connectionManagerCreateSpy).calledWithExactly({name: "default", config: "config"});

      // WHEN close
      await service.closeConnections();

      // THEN
      expect(defaultConnection.close).to.have.been.calledWithExactly();
      expect(customConnection.close).to.have.been.calledWithExactly();
    });
  });

  describe("get()", () => {
    it("should return corresponded connections", async () => {
      // GIVEN
      const service = new TypeORMService();

      // WHEN
      await connectionManager.create({config: "config"} as any);
      await connectionManager.create({name: "mydb", config: "config"} as any);
      const result1 = service.get();
      const result2 = service.get("default");
      const result3 = service.get("mydb");

      // THEN
      expect(result1).to.deep.eq(defaultConnection);
      expect(result2).to.deep.eq(defaultConnection);
      expect(result3).to.deep.eq(customConnection);
    });
  });

  describe("has()", () => {
    it("should return corresponded connections existence", async () => {
      // GIVEN
      const service = new TypeORMService();

      // THEN
      expect(service.has()).to.be.false;
      expect(service.has("default")).to.be.false;
      expect(service.has("mydb")).to.be.false;

      // WHEN
      await connectionManager.create({name: "mydb", config: "config"} as any);

      // THEN
      expect(service.has()).to.be.false;
      expect(service.has("default")).to.be.false;
      expect(service.has("mydb")).to.be.true;

      // WHEN
      await connectionManager.create({config: "config"} as any);

      // THEN
      expect(service.has()).to.be.true;
      expect(service.has("default")).to.be.true;
      expect(service.has("mydb")).to.be.true;
    });
  });
});
