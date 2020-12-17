import {expect} from "chai";
import Sinon from "sinon";
import {PreHook} from "../../src/decorators";
import {schemaOptions} from "../../src/utils/schemaOptions";

const sandbox = Sinon.createSandbox();
describe("@PreHook()", () => {
  describe("when decorator is used as class decorator", () => {
    it("should call applySchemaOptions", () => {
      // GIVEN
      const fn = sandbox.stub();

      // WHEN
      @PreHook("method", fn, {query: true})
      class Test {}

      // THEN
      const options = schemaOptions(Test);

      expect(options).to.deep.eq({
        pre: [
          {
            method: "method",
            fn,
            options: {
              query: true
            }
          }
        ]
      });
    });
  });

  describe("when decorator is used as method decorator", () => {
    it("should call applySchemaOptions", () => {
      class Test {
        @PreHook("save", {
          query: true
        })
        static method() {}
      }

      const {
        pre: [options]
      } = schemaOptions(Test);

      expect(options.method).to.eq("save");
      expect(options.fn).to.be.a("function");
      expect(options.options).to.deep.eq({
        query: true
      });
    });
  });
});
