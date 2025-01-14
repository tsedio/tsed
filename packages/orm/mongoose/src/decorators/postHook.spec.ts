import {schemaOptions} from "../utils/schemaOptions.js";
import {PostHook} from "./postHook.js";

describe("@PostHook()", () => {
  describe("when decorator is used as class decorator", () => {
    it("should call applySchemaOptions", () => {
      // GIVEN
      const fn = vi.fn();

      // WHEN
      @PostHook("save", fn)
      class Test {}

      // THEN
      const options = schemaOptions(Test);

      expect(options).toEqual({
        post: [
          {
            method: "save",
            fn,
            options: undefined
          }
        ]
      });
    });
  });

  describe("when decorator is used as method decorator", () => {
    it("should call applySchemaOptions", () => {
      class Test {
        @PostHook("save", {})
        static method() {}
      }

      const {
        post: [options]
      } = schemaOptions(Test);

      expect(options.method).toEqual("save");
      expect(options.fn).toBeInstanceOf(Function);
    });
  });
});
