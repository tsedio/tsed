import {enums} from "../../utils/from";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {Enum} from "./enum";

describe("@Enum", () => {
  describe("when enum is a list of values", () => {
    it("should declare prop (uniq type)", () => {
      // WHEN
      class Model {
        @Enum("0", "1")
        num: string;
      }

      expect(getJsonSchema(Model)).toEqual({
        properties: {
          num: {
            enum: ["0", "1"],
            type: "string"
          }
        },
        type: "object"
      });
    });
    it("should declare prop (mixed type)", () => {
      // WHEN
      class Model {
        @Enum("0", "1", 10)
        num: string | number;
      }

      expect(getJsonSchema(Model)).toEqual({
        properties: {
          num: {
            enum: ["0", "1", 10],
            type: ["string", "number"]
          }
        },
        type: "object"
      });
    });
    it("should declare prop (mixed type and null)", () => {
      // WHEN
      class Model {
        @Enum("0", "1", 10, null)
        num: string | number;
      }

      expect(getJsonSchema(Model)).toEqual({
        properties: {
          num: {
            enum: ["0", "1", 10, null],
            type: ["null", "string", "number"]
          }
        },
        type: "object"
      });
    });
  });

  describe("when is a typescript enum (string)", () => {
    it("should declare prop", () => {
      enum SomeEnum {
        ENUM_1 = "enum1",
        ENUM_2 = "enum2"
      }

      // WHEN
      class Model {
        @Enum(SomeEnum)
        num: SomeEnum;
      }

      expect(getJsonSchema(Model)).toEqual({
        properties: {
          num: {
            enum: ["enum1", "enum2"],
            type: "string"
          }
        },
        type: "object"
      });
    });
  });

  describe("when is a typescript enum (index)", () => {
    it("should declare prop", () => {
      enum SomeEnum {
        ENUM_1,
        ENUM_2
      }

      // WHEN
      class Model {
        @Enum(SomeEnum)
        num: SomeEnum;
      }

      expect(getJsonSchema(Model)).toEqual({
        properties: {
          num: {
            enum: [0, 1],
            type: "number"
          }
        },
        type: "object"
      });
    });
  });

  describe("when is a typescript enum (mixed type)", () => {
    it("should declare prop", () => {
      enum SomeEnum {
        ENUM_1,
        ENUM_2 = "test",
        ENUM_3 = "test2"
      }

      // WHEN
      class Model {
        @Enum(SomeEnum)
        num: SomeEnum;
      }

      expect(getJsonSchema(Model)).toEqual({
        properties: {
          num: {
            enum: [0, "test", "test2"],
            type: ["number", "string"]
          }
        },
        type: "object"
      });
    });
  });
  describe("when is a typescript enum with a label (set enum schema)", () => {
    it("should declare prop with a shared enum in definitions", () => {
      enum SomeEnum {
        ENUM_1,
        ENUM_2 = "test",
        ENUM_3 = "test2"
      }

      const enumValues = enums(SomeEnum).label("SomeEnum");

      // WHEN
      class Model {
        @Enum(enumValues)
        num: SomeEnum;
      }

      expect(getJsonSchema(Model)).toEqual({
        definitions: {
          SomeEnum: {
            enum: [0, "test", "test2"],
            type: ["number", "string"]
          }
        },
        properties: {
          num: {
            $ref: "#/definitions/SomeEnum"
          }
        },
        type: "object"
      });
    });
  });
  describe("when is a typescript enum with a label (set enum)", () => {
    it("should declare prop with a shared enum in definitions", () => {
      enum SomeEnum {
        ENUM_1,
        ENUM_2 = "test",
        ENUM_3 = "test2"
      }

      enums(SomeEnum).label("SomeEnum");

      // WHEN
      class Model {
        @Enum(SomeEnum)
        num: SomeEnum;
      }

      expect(getJsonSchema(Model)).toEqual({
        definitions: {
          SomeEnum: {
            enum: [0, "test", "test2"],
            type: ["number", "string"]
          }
        },
        properties: {
          num: {
            $ref: "#/definitions/SomeEnum"
          }
        },
        type: "object"
      });
    });
  });

  describe("when is a typescript enum schema without label (set enum)", () => {
    it("should inline enum", () => {
      enum SomeEnum {
        ENUM_1,
        ENUM_2 = "test",
        ENUM_3 = "test2"
      }

      enums(SomeEnum);

      // WHEN
      class Model {
        @Enum(SomeEnum)
        num: SomeEnum;
      }

      expect(getJsonSchema(Model)).toEqual({
        properties: {
          num: {
            enum: [0, "test", "test2"],
            type: ["number", "string"]
          }
        },
        type: "object"
      });
    });
  });
});
