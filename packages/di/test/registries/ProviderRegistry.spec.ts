import * as Sinon from "sinon";
import {GlobalProviders, registerProvider} from "../../src";

describe("ProviderRegistry", () => {
  describe("registerProvider()", () => {
    describe("when provide field is not given", () => {
      before(() => {
        this.mergeStub = Sinon.stub(GlobalProviders, "merge");
        this.hasStub = Sinon.stub(GlobalProviders, "has").returns(false);
        try {
          registerProvider({provide: undefined});
        } catch (er) {
          this.error = er;
        }
      });

      after(() => {
        this.hasStub.restore();
        this.mergeStub.restore();
      });

      it("should throw an error", () => {
        this.error.message.should.deep.eq("Provider.provide is required");
      });
    });

    describe("when a configuration is given", () => {
      class Test {}

      before(() => {
        this.mergeStub = Sinon.stub(GlobalProviders, "merge");
        registerProvider({provide: Test});
      });

      after(() => {
        this.mergeStub.restore();
      });

      it("should call ProviderRegistry.merge()", () => {
        this.mergeStub.should.have.been.calledWithExactly(Test, {
          provide: Test
        });
      });
    });
  });
});
