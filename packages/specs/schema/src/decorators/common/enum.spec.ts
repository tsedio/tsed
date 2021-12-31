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
    enum SomeEnum {
      ENUM_1 = "enum1",
      ENUM_2 = "enum2"
    }

    it("should declare prop", () => {
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
    enum SomeEnum {
      ENUM_1,
      ENUM_2
    }

    it("should declare prop", () => {
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
    enum SomeEnum {
      ENUM_1,
      ENUM_2 = "test",
      ENUM_3 = "test2"
    }

    it("should declare prop", () => {
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
