import {expect} from "chai";
import {PlatformTest} from "@tsed/common";
import * as proxyquire from "proxyquire";
import * as Sinon from "sinon";

const sandbox = Sinon.createSandbox();

class ApolloServer {
  args: any[];

  constructor(...args: any[]) {
    this.args = args;
  }

  applyMiddleware() {}

  installSubscriptionHandlers() {}
}

const {GraphQLService} = proxyquire("../../src/services/GraphQLService", {
  "apollo-server-express": {
    ApolloServer
  }
});

describe("GraphQLService", () => {
  describe("createServer()", () => {
    describe("when server options isn't given", () => {
      let service: any;
      before(PlatformTest.create);
      before(
        PlatformTest.inject([GraphQLService], (_service_: any) => {
          service = _service_;
          sandbox.stub(_service_, "createSchema");
          sandbox.stub(_service_, "createDataSources");
          sandbox.stub(ApolloServer.prototype, "applyMiddleware");
        })
      );

      after(() => {
        PlatformTest.reset();
        sandbox.restore();
      });

      it("should create a server", async () => {
        const noop = () => ({});
        // GIVEN
        service.createSchema.returns({schema: "schema"});
        service.createDataSources.returns(noop);
        // WHEN

        const result1 = await service.createServer("key", {
          path: "/path"
        } as any);
        const result2 = await service.createServer("key", {path: "/path"} as any);

        expect(result2).to.deep.eq(result1);
        expect(result1.args).to.deep.eq([{schema: {schema: "schema"}, dataSources: noop}]);
        expect(service.createSchema).to.have.been.calledOnceWithExactly({
          resolvers: [],
          container: service.injectorService
        });
        expect(result1.applyMiddleware).to.have.been.calledOnceWithExactly(
          Sinon.match({
            app: Sinon.match.func,
            path: "/path"
          })
        );
      });
    });

    describe("when server options is given", () => {
      let service: any;
      before(PlatformTest.create);
      before(
        PlatformTest.inject([GraphQLService], (_service_: any) => {
          service = _service_;
          sandbox.stub(_service_, "createSchema");
          sandbox.stub(_service_, "createDataSources");
          sandbox.stub(ApolloServer.prototype, "applyMiddleware");
          sandbox.stub(ApolloServer.prototype, "installSubscriptionHandlers");
        })
      );

      after(() => {
        PlatformTest.reset();
        sandbox.restore();
      });

      it("should create a custom server", async () => {
        const noop = () => ({});
        // GIVEN
        service.createSchema.returns({schema: "schema"});
        service.createDataSources.returns(noop);

        // WHEN
        const result = await service.createServer("key", {
          path: "/path",
          server(options: any) {
            return new ApolloServer(options);
          },
          installSubscriptionHandlers: true
        } as any);

        expect(result.args).to.deep.eq([{schema: {schema: "schema"}, dataSources: noop}]);
        expect(service.createSchema).to.have.been.calledOnceWithExactly({
          resolvers: [],
          container: service.injectorService
        });

        expect(result.applyMiddleware).to.have.been.calledOnceWithExactly(
          Sinon.match({
            app: Sinon.match.func,
            path: "/path"
          })
        );

        expect(result.installSubscriptionHandlers).to.have.been.calledWithExactly(service.httpServer);
      });
    });
  });
  describe("getSchema()", () => {
    let service: any;
    before(PlatformTest.create);
    before(
      PlatformTest.inject([GraphQLService], (_service_: any) => {
        service = _service_;
        sandbox.stub(_service_, "createSchema");
        sandbox.stub(ApolloServer.prototype, "applyMiddleware");
      })
    );

    after(() => {
      PlatformTest.reset();
      sandbox.restore();
    });

    it("should create a server", async () => {
      // GIVEN
      service.createSchema.returns({schema: "schema"});

      await service.createServer("key", {
        path: "/path"
      } as any);

      // WHEN
      const result = service.getSchema("key");

      expect(result).to.deep.eq({schema: "schema"});
    });
  });
  describe("createDataSources", () => {
    it(
      "should return a function with all dataSources",
      PlatformTest.inject([GraphQLService], (service: any) => {
        const dataSources = sandbox.stub().returns({
          api: "api"
        });
        const serverConfigSources = sandbox.stub().returns({
          api2: "api2"
        });

        const fn = service.createDataSources(dataSources, serverConfigSources);

        expect(fn()).to.deep.eq({
          api2: "api2",
          api: "api"
        });
      })
    );
    it(
      "should do nothing",
      PlatformTest.inject([GraphQLService], (service: any) => {
        const fn = service.createDataSources();

        expect(fn()).to.deep.eq({});
      })
    );
  });
  describe("getDataSources", () => {
    class DataSource {}

    let service: any;
    before(
      PlatformTest.inject([GraphQLService], (_service: any) => {
        service = _service;
        sandbox.stub(service.injectorService, "getProviders").returns([
          {
            name: DataSource.name,
            provide: DataSource
          }
        ]);
        sandbox.stub(service.injectorService, "invoke").returns(new DataSource());
      })
    );
    after(() => {
      sandbox.restore();
    });
    it("should return a function with all dataSources", () => {
      const result = service.getDataSources();

      expect(result).to.deep.eq({
        dataSource: new DataSource()
      });
    });
  });
});
