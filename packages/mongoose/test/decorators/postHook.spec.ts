import * as Sinon from "sinon";
import {Model, PostHook} from "../../src/decorators";
import {schemaOptions} from "../../src/utils/schemaOptions";

const sandbox = Sinon.createSandbox();
describe("@PostHook()", () => {
  describe("when decorator is used as class decorator", () => {
    it("should call applySchemaOptions", () => {
      // GIVEN
      const fn = sandbox.stub();

      // WHEN
      @Model({name: "TestPostHook"})
      @PostHook("method", fn)
      class Test {
      }

      // THEN
      const options = schemaOptions(Test);

      options.should.deep.eq({
        name: "TestPostHook",
        post: [
          {
            method: "method",
            fn
          }
        ]
      });
    });
  });

  describe("when decorator is used as method decorator", () => {
    it("should call applySchemaOptions", () => {
      class Test {
        @PostHook("save")
        static method() {
        }
      }

      const {post: [options]} = schemaOptions(Test);

      options.method.should.eq("save");
      options.fn.should.be.a("function");
    });
  });
});
