import {inject, TestContext} from "@tsed/testing";
import * as proxyquire from "proxyquire";
import * as Sinon from "sinon";

const sandbox = Sinon.createSandbox();


class ApolloServer {
  args: any[];

  constructor(...args: any[]) {
    this.args = args;
  }

  applyMiddleware() {

  }

  installSubscriptionHandlers() {

  }
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
      before(TestContext.create);
      before(inject([GraphQLService], (_service_: any) => {
        service = _service_;
        sandbox.stub(_service_, "createSchema");
        sandbox.stub(_service_, "createDataSources");
        sandbox.stub(ApolloServer.prototype, "applyMiddleware");
      }));

      after(() => {
        TestContext.reset();
        sandbox.restore();
      });

      it("should create a server", async () => {
        const noop = () => ({});
        // GIVEN
        service.createSchema.returns({"schema": "schema"});
        service.createDataSources.returns(noop);
        // WHEN

        const result1 = await service.createServer("key", {
          path: "/path"
        } as any);
        const result2 = await service.createServer("key", {path: "/path"} as any);

        result2.should.deep.eq(result1);
        result1.args.should.deep.eq([{schema: {schema: "schema"}, dataSources: noop}]);
        service.createSchema.should.have.been.calledOnceWithExactly({resolvers: [], container: service.injectorService});
        result1.applyMiddleware.should.have.been.calledOnceWithExactly(Sinon.match({
          app: Sinon.match.func,
          path: "/path"
        }));
      });
    });

    describe("when server options is given", () => {
      let service: any;
      before(TestContext.create);
      before(inject([GraphQLService], (_service_: any) => {
        service = _service_;
        sandbox.stub(_service_, "createSchema");
        sandbox.stub(_service_, "createDataSources");
        sandbox.stub(ApolloServer.prototype, "applyMiddleware");
        sandbox.stub(ApolloServer.prototype, "installSubscriptionHandlers");
      }));

      after(() => {
        TestContext.reset();
        sandbox.restore();
      });

      it("should create a custom server", async () => {
        const noop = () => ({});
        // GIVEN
        service.createSchema.returns({"schema": "schema"});
        service.createDataSources.returns(noop);

        // WHEN
        const result = await service.createServer("key", {
          path: "/path",
          server(options: any) {
            return new ApolloServer(options);
          },
          installSubscriptionHandlers: true
        } as any);


        result.args.should.deep.eq([{schema: {schema: "schema"}, dataSources: noop}]);
        service.createSchema.should.have.been.calledOnceWithExactly({resolvers: [], container: service.injectorService});

        result.applyMiddleware.should.have.been.calledOnceWithExactly(Sinon.match({
          app: Sinon.match.func,
          path: "/path"
        }));

        result.installSubscriptionHandlers.should.have.been.calledWithExactly(service.httpServer);
      });
    });

  });
  describe("getSchema()", () => {
    let service: any;
    before(TestContext.create);
    before(inject([GraphQLService], (_service_: any) => {
      service = _service_;
      sandbox.stub(_service_, "createSchema");
      sandbox.stub(ApolloServer.prototype, "applyMiddleware");
    }));

    after(() => {
      TestContext.reset();
      sandbox.restore();
    });

    it("should create a server", async () => {
      // GIVEN
      service.createSchema.returns({"schema": "schema"});

      await service.createServer("key", {
        path: "/path"
      } as any);

      // WHEN
      const result = service.getSchema("key");

      result.should.deep.eq({"schema": "schema"});
    });
  });
  describe("createDataSources", () => {
    it("should return a function with all dataSources", inject([GraphQLService], (service: any) => {
      const dataSources = sandbox.stub().returns({
        api: "api"
      });
      const serverConfigSources = sandbox.stub().returns({
        api2: "api2"
      });

      const fn = service.createDataSources(dataSources, serverConfigSources);

      fn().should.deep.eq({
        api2: "api2",
        api: "api"
      });
    }));
    it("should do nothing", inject([GraphQLService], (service: any) => {
      const fn = service.createDataSources();

      fn().should.deep.eq({});
    }));
  });
});
