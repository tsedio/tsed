import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import proxyquire from "proxyquire";
import Sinon from "sinon";

const sandbox = Sinon.createSandbox();

class ApolloServer {
  args: any[];
  applyMiddleware: Sinon.SinonStub<any[], any>;
  installSubscriptionHandlers: Sinon.SinonStub<any[], any>;

  constructor(...args: any[]) {
    this.args = args;
    this.applyMiddleware = Sinon.stub();
    this.installSubscriptionHandlers = Sinon.stub();
  }
}

const {ApolloService} = proxyquire("../../src/services/ApolloService", {
  "apollo-server-express": {
    ApolloServer
  }
});

describe("ApolloService", () => {
  beforeEach(() =>
    PlatformTest.create({
      PLATFORM_NAME: "express"
    })
  );
  afterEach(() => {
    sandbox.restore();
    return PlatformTest.reset();
  });

  describe("createServer()", () => {
    describe("when server options isn't given", () => {
      it("should create a server", async () => {
        // GIVEN
        const service = PlatformTest.get(ApolloService);

        // WHEN
        const result1 = await service.createServer("key", {
          path: "/path"
        } as any);

        const result2 = await service.createServer("key", {path: "/path"} as any);

        expect(service.getSchema("key")).to.deep.eq(undefined);
        expect(service.getSchema()).to.deep.eq(undefined);
        expect(result2).to.deep.eq(result1);
        expect(result1).to.be.instanceof(ApolloServer);
        expect(result1.applyMiddleware).to.have.been.calledOnceWithExactly(
          Sinon.match({
            app: Sinon.match.func,
            path: "/path"
          })
        );
      });

      it("should create a server with schema", async () => {
        // GIVEN
        const service = PlatformTest.get(ApolloService);

        // WHEN
        const result1 = await service.createServer("key", {
          path: "/path",
          schema: "schema"
        } as any);

        const result2 = await service.createServer("key", {path: "/path"} as any);

        expect(service.getSchema("key")).to.deep.eq("schema");
        expect(result2).to.deep.eq(result1);
        expect(result1).to.be.instanceof(ApolloServer);
        expect(result1.applyMiddleware).to.have.been.calledOnceWithExactly(
          Sinon.match({
            app: Sinon.match.func,
            path: "/path"
          })
        );
      });
    });
    describe("when server options is given", () => {
      it("should create a custom server", async () => {
        // GIVEN
        const service = PlatformTest.get(ApolloService);

        // WHEN
        const result = await service.createServer("key", {
          path: "/path",
          server(options: any) {
            return new ApolloServer(options);
          },
          installSubscriptionHandlers: true
        } as any);

        expect(result).to.be.instanceof(ApolloServer);

        expect(result.applyMiddleware).to.have.been.calledOnceWithExactly(
          Sinon.match({
            app: Sinon.match.func,
            path: "/path"
          })
        );
        // @ts-ignore
        expect(result.installSubscriptionHandlers).to.have.been.calledWithExactly(service.httpServer);
      });
    });
  });
});
