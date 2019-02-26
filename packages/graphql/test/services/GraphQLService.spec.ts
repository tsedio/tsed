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
}

const {GraphQLService} = proxyquire("../../src/services/GraphQLService", {
  "apollo-server-express": {
    ApolloServer
  }
});

describe("GraphQLService", () => {
  describe("createServer()", () => {
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

    it("should call mongoose.connect", async () => {
      // GIVEN
      service.createSchema.returns({"schema": "schema"});
      // WHEN

      const result1 = await service.createServer("key", {
        path: "/path"
      } as any);
      const result2 = await service.createServer("key", {path: "/path"} as any);

      result2.should.deep.eq(result1);
      result1.args.should.deep.eq([{schema: {schema: "schema"}}]);
      service.createSchema.should.have.been.calledOnceWithExactly({resolvers: []});
      result1.applyMiddleware.should.have.been.calledOnceWithExactly(Sinon.match({
        app: Sinon.match.func,
        path: "/path"
      }));
    });
  });
});
