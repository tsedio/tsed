import {JsonSchemesRegistry} from "../../../../src/jsonschema/registries/JsonSchemesRegistry";
import {JsonAgeModel, JsonFoo2} from "../../../helper/classes";
import {expect} from "../../../tools";

describe("JsonProperty()", () => {
    it("should create a schema", () => {
        expect(JsonSchemesRegistry.getSchemaDefinition(JsonFoo2)).to.deep.eq({
            "definitions": {
                "JsonAgeModel": {
                    "properties": {
                        "age": {
                            "type": "number"
                        }
                    },
                    "type": "object"
                },
                "JsonNameModel": {
                    "properties": {
                        "name": {
                            "type": "string"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "test",
                "foo"
            ],
            "properties": {
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
                    "type": "object"
                },
                "foos": {
                    "items": {
                        "type": "object"
                    },
                    "type": "array"
                },
                "mapOfString": {
                    "additionalProperties": {
                        "type": "string"
                    }
                },
                "name": {
                    "minLength": 3,
                    "type": "string"
                },
                "object": {
                    "type": "object"
                },
                "nameModel": {
                    "$ref": "#/definitions/JsonNameModel"
                },
                "test": {
                    "minLength": 3,
                    "type": "string"
                },
                "theMap": {
                    "additionalProperties": {
                        "type": "object"
                    }
                },
                "theSet": {
                    "additionalProperties": {
                        "type": "object"
                    }
                },
                "uint": {
                    "type": "number"
                }
            },
            "type": "object"
        });
    });
});