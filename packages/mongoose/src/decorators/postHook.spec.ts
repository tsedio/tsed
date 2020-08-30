import {expect} from "chai";
import * as Sinon from "sinon";
import {PostHook} from "../../src/decorators";
import {schemaOptions} from "../../src/utils/schemaOptions";

const sandbox = Sinon.createSandbox();
describe("@PostHook()", () => {
  describe("when decorator is used as class decorator", () => {
    it("should call applySchemaOptions", () => {
      // GIVEN
      const fn = sandbox.stub();

      // WHEN
      @PostHook("method", fn)
      class Test {}

      // THEN
      const options = schemaOptions(Test);

      expect(options).to.deep.eq({
        post: [
          {
            method: "method",
            fn,
          },
        ],
      });
    });
  });

  describe("when decorator is used as method decorator", () => {
    it("should call applySchemaOptions", () => {
      class Test {
        @PostHook("save")
        static method() {}
      }

      const {
        post: [options],
      } = schemaOptions(Test);

      expect(options.method).to.eq("save");
      expect(options.fn).to.be.a("function");
    });
  });
});
