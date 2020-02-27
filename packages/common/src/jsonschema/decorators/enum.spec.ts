import {Enum, JsonSchema} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("Enum", () => {
  describe("when enum is a list of values", () => {
    before(() => {
      this.decorateStub = stubSchemaDecorator();
      this.schema = new JsonSchema();
      Enum("0", "1");
      this.decorateStub.getCall(0).args[0](this.schema);
    });
    after(() => {
      this.decorateStub.restore();
    });

    it("should store data", () => {
      this.schema.enum.should.deep.eq(["0", "1"]);
    });
  });

  describe("when is a typescript enum (string)", () => {
    enum SomeEnum {
      ENUM_1 = "enum1",
      ENUM_2 = "enum2"
    }

    before(() => {
      this.decorateStub = stubSchemaDecorator();
      this.schema = new JsonSchema();
      Enum(SomeEnum);
      this.decorateStub.getCall(0).args[0](this.schema);
    });
    after(() => {
      this.decorateStub.restore();
    });

    it("should store data", () => {
      this.schema.type.should.eq("string");
      this.schema.enum.should.deep.eq(["enum1", "enum2"]);
    });
  });

  describe("when is a typescript enum (index)", () => {
    enum SomeEnum {
      ENUM_1,
      ENUM_2
    }

    before(() => {
      this.decorateStub = stubSchemaDecorator();
      this.schema = new JsonSchema();
      Enum(SomeEnum);
      this.decorateStub.getCall(0).args[0](this.schema);
    });
    after(() => {
      this.decorateStub.restore();
    });

    it("should store data", () => {
      this.schema.type.should.eq("number");
      this.schema.enum.should.deep.eq([0, 1]);
    });
  });

  describe("when is a typescript enum (mixed type)", () => {
    enum SomeEnum {
      ENUM_1,
      ENUM_2 = "test",
      ENUM_3 = "test2"
    }

    before(() => {
      this.decorateStub = stubSchemaDecorator();
      this.schema = new JsonSchema();
      Enum(SomeEnum);
      this.decorateStub.getCall(0).args[0](this.schema);
    });
    after(() => {
      this.decorateStub.restore();
    });

    it("should store data", () => {
      this.schema.type.should.deep.eq(["number", "string"]);
      this.schema.enum.should.deep.eq([0, "test", "test2"]);
    });
  });
});
