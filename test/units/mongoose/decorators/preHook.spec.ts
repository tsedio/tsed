import {PreHook} from "../../../../packages/mongoose/src/decorators";
import * as mod from "../../../../packages/mongoose/src/utils/schemaOptions";
import * as Sinon from "sinon";

describe("@PreHook()", () => {
  describe("when decorator is used as class decorator", () => {
    class Test {}

    before(() => {
      this.applySchemaOptionsStub = Sinon.stub(mod, "applySchemaOptions");
      this.fn = () => {};
      this.errorCb = () => {};
      PreHook("method", this.fn as any, {parallel: true, errorCb: this.errorCb as any})(Test);
    });

    after(() => {
      this.applySchemaOptionsStub.restore();
    });

    it("should call applySchemaOptions", () => {
      this.applySchemaOptionsStub.should.have.been.calledWithExactly(Test, {
        pre: [
          {
            method: "method",
            parallel: true,
            fn: this.fn,
            errorCb: this.errorCb
          }
        ]
      });
    });
  });

  describe("when decorator is used as method decorator", () => {
    before(() => {
      this.applySchemaOptionsStub = Sinon.stub(mod, "applySchemaOptions");

      class Test {
        @PreHook("save", {parallel: true, errorCb: "errorCb" as any})
        static method() {}
      }

      this.clazz = Test;
    });

    after(() => {
      this.applySchemaOptionsStub.restore();
    });

    it("should call applySchemaOptions", () => {
      this.applySchemaOptionsStub.should.have.been.calledWithExactly(this.clazz, {
        pre: [
          {
            method: "save",
            parallel: true,
            fn: Sinon.match.func,
            errorCb: "errorCb"
          }
        ]
      });
    });
  });
});
