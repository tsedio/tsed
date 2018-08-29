import {PostHook} from "../../../../packages/mongoose/decorators";
import * as mod from "../../../../packages/mongoose/utils/schemaOptions";
import {Sinon} from "../../../tools";

describe("@PostHook()", () => {
  describe("when decorator is used as class decorator", () => {
    class Test {}

    before(() => {
      this.applySchemaOptionsStub = Sinon.stub(mod, "applySchemaOptions");
      this.fn = () => {};
      PostHook("method", this.fn as any)(Test);
    });

    after(() => {
      this.applySchemaOptionsStub.restore();
    });

    it("should call applySchemaOptions", () => {
      this.applySchemaOptionsStub.should.have.been.calledWithExactly(Test, {
        post: [
          {
            method: "method",
            fn: this.fn
          }
        ]
      });
    });
  });

  describe("when decorator is used as method decorator", () => {
    before(() => {
      this.applySchemaOptionsStub = Sinon.stub(mod, "applySchemaOptions");

      class Test {
        @PostHook("save")
        static method() {}
      }

      this.clazz = Test;
    });

    after(() => {
      this.applySchemaOptionsStub.restore();
    });

    it("should call applySchemaOptions", () => {
      this.applySchemaOptionsStub.should.have.been.calledWithExactly(this.clazz, {
        post: [
          {
            method: "save",
            fn: Sinon.match.func
          }
        ]
      });
    });
  });
});
