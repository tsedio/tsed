import * as Sinon from "sinon";
import {Model, PreHook} from "../../src/decorators";
import {schemaOptions} from "../../src/utils/schemaOptions";

const sandbox = Sinon.createSandbox();
describe("@PreHook()", () => {
  describe("when decorator is used as class decorator", () => {
    it("should call applySchemaOptions", () => {
      // GIVEN
      const fn = sandbox.stub();
      const errorCb = sandbox.stub();

      // WHEN
      @Model({name: "TestPreHook"})
      @PreHook("method", fn, {parallel: true, errorCb: errorCb as any})
      class Test {
      }

      // THEN
      const options = schemaOptions(Test);

      options.should.deep.eq({
        name: "TestPreHook",
        pre: [
          {
            method: "method",
            parallel: true,
            fn,
            errorCb
          }
        ]
      });
    });
  });

  describe("when decorator is used as method decorator", () => {
    it("should call applySchemaOptions", () => {
      class Test {
        @PreHook("save", {
          parallel: true, errorCb: () => {
          }
        })
        static method() {
        }
      }

      const {pre: [options]} = schemaOptions(Test);

      options.method.should.eq("save");
      options.parallel.should.eq(true);
      options.fn.should.be.a("function");
      options.errorCb.should.be.a("function");
    });
  });
});
