import {getJsonSchema} from "@tsed/common";
import {Property} from "@tsed/schema";
import {expect} from "chai";
import {Circular, IndirectCircular, JsonFoo2, Thingy} from "../../../test/helper/classes";

describe("JsonSchemesService", () => {
  describe("use case 1", () => {
    it("should return a schema with his definitions", () => {
      // GIVEN
      const result = getJsonSchema(JsonFoo2);

      // WHEN
      expect(result).to.deep.eq({
        "definitions": {
          "JsonAgeModel": {
            "properties": {
              "age": {
                "type": "number"
              },
              "id": {
                "type": "string"
              }
            },
            "type": "object"
          },
          "JsonFoo": {
            "type": "object"
          },
          "JsonFoo1": {
            "properties": {
              "test": {
                "type": "string"
              }
            },
            "type": "object"
          },
          "JsonNameModel": {
            "properties": {
              "id": {
                "type": "string"
              },
              "name": {
                "type": "string"
              }
            },
            "type": "object"
          }
        },
        "properties": {
          "Name": {
            "minLength": 3,
            "type": "string"
          },
          "ageModel": {
            "$ref": "#/definitions/JsonAgeModel"
          },
          "arrayOfString": {
            "items": {
              "type": "string"
            },
            "type": "array"
          },
          "dateStart": {
            "type": "string"
          },
          "foo": {
            "$ref": "#/definitions/JsonFoo"
          },
          "foos": {
            "items": {
              "$ref": "#/definitions/JsonFoo"
            },
            "type": "array"
          },
          "foos2": {
            "items": {
              "$ref": "#/definitions/JsonFoo1"
            },
            "type": "array"
          },
          "mapOfString": {
            "additionalProperties": {
              "type": "string"
            },
            "type": "object"
          },
          "nameModel": {
            "$ref": "#/definitions/JsonNameModel"
          },
          "object": {
            "type": "object"
          },
          "test": {
            "minLength": 3,
            "type": "string"
          },
          "theMap": {
            "additionalProperties": {
              "$ref": "#/definitions/JsonFoo1"
            },
            "type": "object"
          },
          "theSet": {
            "items": {
              "$ref": "#/definitions/JsonFoo1"
            },
            "type": "array",
            "uniqueItems": true
          },
          "uint": {
            "type": "number"
          }
        },
        "required": [
          "test",
          "foo"
        ],
        "type": "object"
      });
    });
  });

  describe("use case 2", () => {
    it("should return a schema with his definitions", () => {
      expect(getJsonSchema(Thingy)).to.deep.eq({
        definitions: {
          Stuff: {
            properties: {
              name: {
                type: "string"
              },
              nested: {
                $ref: "#/definitions/Nested"
              }
            },
            type: "object"
          },
          Nested: {
            properties: {
              count: {
                type: "number"
              }
            },
            type: "object"
          }
        },
        properties: {
          stuff: {
            $ref: "#/definitions/Stuff"
          }
        },
        type: "object"
      });
    });
  });

  describe("Inheritance", () => {
    it("should return a schema with his definitions", () => {
      class M1 {
        @Property()
        public name: string;
      }

      class M2 extends M1 {
        @Property()
        public age: number;
      }

      class M3 {
        @Property()
        public nested: M2;
      }

      expect(getJsonSchema(M2)).to.deep.eq({
        "properties": {
          "age": {
            "type": "number"
          },
          "name": {
            "type": "string"
          }
        },
        "type": "object"
      });
      expect(getJsonSchema(M3)).to.deep.eq({
        definitions: {
          M2: {
            properties: {
              name: {
                type: "string"
              },
              age: {
                type: "number"
              }
            },
            type: "object"
          }
        },
        properties: {
          nested: {
            $ref: "#/definitions/M2"
          }
        },
        type: "object"
      });
    });
  });

  describe("with circular reference", () => {
    it("should return a schema with his definitions", () => {
      expect(getJsonSchema(Circular)).to.deep.eq({
        definitions: {
          Circular: {
            properties: {
              parent: {
                $ref: "#/definitions/Circular"
              }
            },
            type: "object"
          }
        },
        properties: {
          parent: {
            $ref: "#/definitions/Circular"
          }
        },
        type: "object"
      });
    });
  });

  describe("with indirect circular reference", () => {
    it("should return a schema with his definitions", () => {
      expect(getJsonSchema(IndirectCircular)).to.deep.eq({
        definitions: {
          Dependency: {
            properties: {
              dep: {
                $ref: "#/definitions/IndirectCircular"
              }
            },
            type: "object"
          },
          IndirectCircular: {
            properties: {
              parent: {
                $ref: "#/definitions/Dependency"
              }
            },
            type: "object"
          }
        },
        properties: {
          parent: {
            $ref: "#/definitions/Dependency"
          }
        },
        type: "object"
      });
    });
  });
});
