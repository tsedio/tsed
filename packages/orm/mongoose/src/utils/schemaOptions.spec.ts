import {applySchemaOptions, schemaOptions} from "../../src/utils/schemaOptions.js";

describe("schemaOptions", () => {
  describe("schemaOptions()", () => {
    class Test {}

    beforeEach(() => {});

    it("should return schema options (1)", () => {
      expect(schemaOptions(Test)).toEqual({});
    });

    it("should return schema options (2)", () => {
      expect(schemaOptions(Test, {options: "options"} as any)).toEqual({options: "options"});
    });

    it("should return schema options (3)", () => {
      expect(schemaOptions(Test, {options2: "options2"} as any)).toEqual({
        options: "options",
        options2: "options2"
      });
    });
  });
  describe("applySchemaOptions()", () => {
    const schema: any = {
      pre: jest.fn(),
      post: jest.fn(),
      plugin: jest.fn(),
      index: jest.fn()
    };

    beforeEach(() => {
      applySchemaOptions(schema, {
        pre: [
          {
            method: "method",
            fn: (doc: any, pre: any) => {},
            options: {query: true}
          }
        ],
        post: [
          {
            method: "method",
            fn: "fn"
          }
        ],
        plugins: [{plugin: "plugin", options: "options"}],
        indexes: [{fields: "fields", options: "options"}]
      } as any);
    });

    it("should call schema.pre", () => {
      expect(schema.pre).toHaveBeenCalledWith("method", {query: true}, expect.any(Function));
    });

    it("should call schema.post", () => {
      expect(schema.post).toHaveBeenCalledWith("method", "fn");
    });

    it("should call schema.plugin", () => {
      expect(schema.plugin).toHaveBeenCalledWith("plugin", "options");
    });

    it("should call schema.index", () => {
      expect(schema.index).toHaveBeenCalledWith("fields", "options");
    });
  });
});
