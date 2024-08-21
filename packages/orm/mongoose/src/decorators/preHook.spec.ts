import {MongooseNextCB, PreHook, schemaOptions} from "../../src/index.js";

describe("@PreHook()", () => {
  describe("when decorator is used as class decorator", () => {
    it("should call applySchemaOptions", () => {
      // GIVEN
      const fn = vi.fn();

      // WHEN
      @PreHook("method", fn, {query: true})
      class Test {}

      // THEN
      const options = schemaOptions(Test);

      expect(options).toEqual({
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
    it("should call applySchemaOptions with more options", () => {
      // GIVEN
      const fn: any = vi.fn((instance: any, next: MongooseNextCB, options: any) => {
        return instance;
      });

      // WHEN
      @PreHook("method", fn, {query: true})
      class Test {}

      // THEN
      const options = schemaOptions(Test);

      expect(options).toEqual({
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

      expect(options.method).toBe("save");
      expect(options.fn).toBeInstanceOf(Function);
      expect(options.options).toEqual({
        query: true
      });
    });
  });
});
