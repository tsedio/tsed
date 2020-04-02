import {expect} from "chai";
import {JsonSchema} from "./JsonSchema";

describe("JsonSchema", () => {
  describe("toCollection()", () => {
    describe("when the type is string", () => {
      before(() => {});

      it("should have a correct jsonSchema", () => {
        const schema = new JsonSchema();
        schema.type = String;
        schema.toCollection(Array);
        expect(schema.toJSON()).to.deep.eq({
          type: "array",
          items: {
            type: "string"
          }
        });
      });
    });

    describe("when the type is object", () => {
      it("should have a correct jsonSchema", () => {
        const schema = new JsonSchema();
        schema.type = Object;
        schema.toCollection(Array);
        expect(schema.toJSON()).to.deep.eq({
          type: "array",
          items: {
            type: "object"
          }
        });
      });
    });

    describe("when the type is number or string", () => {
      it("should have a correct jsonSchema", () => {
        const schema = new JsonSchema();
        schema.type = ["number", "string"];
        expect(schema.toJSON()).to.deep.eq({
          type: ["number", "string"]
        });
      });
    });

    describe("when the type is an array number or string (1)", () => {
      it("should have a correct jsonSchema", () => {
        const schema = new JsonSchema();
        schema.type = ["number", "string"];
        schema.toCollection(Array);
        expect(schema.toJSON()).to.deep.eq({
          type: "array",
          items: {
            type: ["number", "string"]
          }
        });
      });
    });

    describe("when the type is an array of number or string (2)", () => {
      it("should have a correct jsonSchema", () => {
        const schema = new JsonSchema();
        schema.type = Object;
        schema.toCollection(Array);
        schema.mapper.type = ["number", "string"];
        expect(schema.toJSON()).to.deep.eq({
          type: "array",
          items: {
            type: ["number", "string"]
          }
        });
      });
    });

    describe("when there have already data", () => {
      it("should have a correct jsonSchema", () => {
        const schema = new JsonSchema();
        schema.type = Object;
        schema.mapValue("type", ["number", "string"]);
        schema.mapValue("enum", ["1", "2"]);

        schema.toCollection(Array);

        expect(schema.toJSON()).to.deep.eq({
          type: "array",
          items: {
            type: ["number", "string"],
            enum: ["1", "2"]
          }
        });
      });
    });
  });

  describe("mapValue()", () => {
    describe("when the schema is a string", () => {
      it("should have a correct jsonSchema", () => {
        const schema = new JsonSchema();
        schema.type = String;
        schema.mapValue("enum", ["1", "2"]);

        expect(schema.toJSON()).to.deep.eq({enum: ["1", "2"], type: "string"});
      });
    });

    describe("when the schema is a array", () => {
      it("should have a correct jsonSchema", () => {
        const schema = new JsonSchema();
        schema.type = String;
        schema.toCollection(Array);
        schema.mapValue("enum", ["1", "2"]);

        expect(schema.toJSON()).to.deep.eq({
          type: "array",
          items: {
            enum: ["1", "2"],
            type: "string"
          }
        });
      });
    });

    describe("when the schema is a Set", () => {
      it("should have a correct jsonSchema", () => {
        const schema = new JsonSchema();
        schema.type = String;
        schema.toCollection(Set);
        schema.mapper.enum = ["1", "2"];
        expect(schema.toJSON()).to.deep.eq({
          additionalProperties: {
            enum: ["1", "2"],
            type: "string"
          }
        });
      });
    });
  });

  describe("getJsonType()", () => {
    it("should return number", () => {
      expect(JsonSchema.getJsonType(Number)).to.eq("number");
    });

    it("should return string", () => {
      expect(JsonSchema.getJsonType(String)).to.eq("string");
    });

    it("should return boolean", () => {
      expect(JsonSchema.getJsonType(Boolean)).to.eq("boolean");
    });

    it("should return array", () => {
      expect(JsonSchema.getJsonType(Array)).to.eq("array");
    });

    it("should return string when date is given", () => {
      expect(JsonSchema.getJsonType(Date)).to.eq("string");
    });

    it("should return object", () => {
      expect(JsonSchema.getJsonType({})).to.eq("object");
    });

    it("should return object when class is given", () => {
      expect(JsonSchema.getJsonType(class {})).to.eq("object");
    });

    it("should return [string] when an array is given", () => {
      expect(JsonSchema.getJsonType(["string"])).to.deep.eq(["string"]);
    });
    it("should return string when an string is given", () => {
      expect(JsonSchema.getJsonType("string")).to.deep.eq("string");
    });
  });

  describe("toJSON()", () => {
    it("should return object", () => {
      const schema = new JsonSchema();
      schema.description = "description";
      schema.type = class Test {};
      expect(schema.toJSON()).to.deep.eq({type: "object", description: "description"});
    });
  });
});
