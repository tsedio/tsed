import * as Sinon from "sinon";
import {MongooseModelRegistry, registerModel} from "../../src";

describe("registerModel()", () => {
  describe("when a class is given", () => {
    class Test {
    }

    before(() => {
      this.mergeStub = Sinon.stub(MongooseModelRegistry, "merge");
      registerModel(Test, {model: "model"});
    });

    after(() => {
      this.mergeStub.restore();
    });

    it("should call ProviderRegistry.merge()", () => {
      this.mergeStub.should.have.been.calledWithExactly(Test, {
        instance: {model: "model"},
        provide: Test,
        type: "mongooseModel"
      });
    });
  });

  describe("when a config is given", () => {
    class Test {
    }

    before(() => {
      this.mergeStub = Sinon.stub(MongooseModelRegistry, "merge");

      registerModel({provide: Test, instance: {model: "model"}});
    });

    after(() => {
      this.mergeStub.restore();
    });

    it("should call ProviderRegistry.merge()", () => {
      this.mergeStub.should.have.been.calledWithExactly(Test, {
        instance: {model: "model"},
        provide: Test,
        type: "mongooseModel"
      });
    });
  });
});
