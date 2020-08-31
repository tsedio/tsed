import {expect} from "chai";
import {Enum, JsonSchema} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("Enum", () => {
  describe("when enum is a list of values", () => {
    it("should store data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      Enum("0", "1");
      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);
      expect(schema.enum).to.deep.eq(["0", "1"]);
      decorateStub.restore();
    });
  });

  describe("when is a typescript enum (string)", () => {
    enum SomeEnum {
      ENUM_1 = "enum1",
      ENUM_2 = "enum2"
    }

    it("should store data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      Enum(SomeEnum);
      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);

      expect(schema.type).to.eq("string");
      expect(schema.enum).to.deep.eq(["enum1", "enum2"]);

      decorateStub.restore();
    });
  });

  describe("when is a typescript enum (index)", () => {
    enum SomeEnum {
      ENUM_1,
      ENUM_2
    }

    it("should store data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      Enum(SomeEnum);
      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);

      expect(schema.type).to.eq("number");
      expect(schema.enum).to.deep.eq([0, 1]);
      decorateStub.restore();
    });
  });

  describe("when is a typescript enum (mixed type)", () => {
    enum SomeEnum {
      ENUM_1,
      ENUM_2 = "test",
      ENUM_3 = "test2"
    }

    it("should store data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      Enum(SomeEnum);
      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);

      expect(schema.type).to.deep.eq(["number", "string"]);
      expect(schema.enum).to.deep.eq([0, "test", "test2"]);

      decorateStub.restore();
    });
  });
});
