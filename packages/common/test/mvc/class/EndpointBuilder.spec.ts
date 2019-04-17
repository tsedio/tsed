import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {InjectorService, Provider} from "../../../../di/src";
import {EndpointMetadata, HandlerBuilder} from "../../../src/mvc";
import {EndpointBuilder} from "../../../src/mvc/class/EndpointBuilder";

class Test {
  method() {
    return "test";
  }
}

describe("EndpointBuilder", () => {
  before(() => {
    Sinon.stub(HandlerBuilder, "from");
  });
  after(() => {
    // @ts-ignore
    HandlerBuilder.from.restore();
  });
  describe("build()", () => {
    it("should build endpoint", () => {
      // GIVEN
      const router: any = {
        use: Sinon.stub(),
        get: Sinon.stub(),
        post: Sinon.stub()
      };

      const provider = new Provider(Test);
      provider.router = router;

      const injector = new InjectorService();
      injector.settings.debug = true;

      Sinon.stub(injector, "getProvider").withArgs(Test).returns(provider);


      const endpointMetadata = new EndpointMetadata(Test, "method");
      endpointMetadata.pathsMethods = [
        {method: "get", path: "/"},
        {method: "post", path: "/other"},
        {path: "/"}
      ];
      endpointMetadata.before([
        "before"
      ]);

      endpointMetadata.after([
        "after"
      ]);

      // @ts-ignore
      HandlerBuilder.from.callsFake((obj) => {
        return {
          build() {
            return obj.methodClassName ? obj.methodClassName : obj;
          }
        };
      });

      // WHEN
      new EndpointBuilder(endpointMetadata).build(injector);

      // THEN
      HandlerBuilder.from.should.have.been.calledWithExactly("before");
      HandlerBuilder.from.should.have.been.calledWithExactly("after");
      HandlerBuilder.from.should.have.been.calledWithExactly(endpointMetadata);
      router.get.should.have.been.calledWithExactly("/", Sinon.match.func, "before", "method", "after");
      router.post.should.have.been.calledWithExactly("/other", Sinon.match.func, "before", "method", "after");
      router.use.should.have.been.calledWithExactly("/", Sinon.match.func, "before", "method", "after");
    });
    it("should build endpoint without path", () => {
      // GIVEN
      const router: any = {
        use: Sinon.stub()
      };

      const provider = new Provider(Test);
      provider.router = router;

      const injector = new InjectorService();
      injector.settings.debug = true;

      Sinon.stub(injector, "getProvider").withArgs(Test).returns(provider);


      const endpointMetadata = new EndpointMetadata(Test, "method");
      endpointMetadata.pathsMethods = [];
      endpointMetadata.before([
        "before"
      ]);

      endpointMetadata.after([
        "after"
      ]);

      // @ts-ignore
      HandlerBuilder.from.callsFake((obj) => {
        return {
          build() {
            return obj.methodClassName ? obj.methodClassName : obj;
          }
        };
      });

      // WHEN
      new EndpointBuilder(endpointMetadata).build(injector);

      // THEN
      router.use.should.have.been.calledWithExactly(Sinon.match.func, "before", "method", "after");
    });
  });
  describe("bindRequest()", () => {
    it("should log request and attach endpoint to the context", () => {
      // GIVEN
      const injector = new InjectorService();
      injector.settings.debug = true;

      const request = new FakeRequest();
      request.method = "GET";
      const response = new FakeResponse();
      const next = Sinon.stub();
      const endpointMetadata = new EndpointMetadata(Test, "method");
      const endpointBuilder = new EndpointBuilder(endpointMetadata);

      // WHEN
      // @ts-ignore
      endpointBuilder.bindRequest(endpointMetadata, injector)(request, response, next);

      // THEN
      request.ctx.endpoint.should.eq(endpointMetadata);
      next.should.have.been.calledWithExactly();

      request.log.debug.should.have.been.calledWithExactly({
        event: "bind.request",
        httpMethod: "GET",
        methodClass: "method",
        target: "Test"
      });
    });

    it("should attach endpoint to the context", () => {
      // GIVEN
      const injector = new InjectorService();
      injector.settings.debug = false;

      const request = new FakeRequest();
      request.method = "GET";
      const response = new FakeResponse();
      const next = Sinon.stub();
      const endpointMetadata = new EndpointMetadata(Test, "method");
      const endpointBuilder = new EndpointBuilder(endpointMetadata);

      // WHEN
      // @ts-ignore
      endpointBuilder.bindRequest(endpointMetadata, injector)(request, response, next);

      // THEN
      request.ctx.endpoint.should.eq(endpointMetadata);
      next.should.have.been.calledWithExactly();

      return request.log.debug.should.not.have.been.called;
    });
  });
});
