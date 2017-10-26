import {JsonSchemesRegistry} from "../../../../src/jsonschema/registries/JsonSchemesRegistry";
import {JsonSchemesService} from "../../../../src/jsonschema/services/JsonSchemesService";
import {inject} from "../../../../src/testing";
import {expect} from "../../../tools";
import {JsonFoo2} from "../../../helper/classes";

describe("JsonSchemesService", () => {
    before(inject([JsonSchemesService], (service: JsonSchemesService) => {
        this.result = service.getSchemaDefinition(JsonFoo2);
    }));
    after(() => {
        JsonSchemesRegistry.clear();
    });

    it("should return a schema with his definitions", () => {
        expect(this.result).to.deep.eq({
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
                    "type": "string"
                },
                "nameModel": {
                    "$ref": "#/definitions/JsonNameModel"
                },
                "object": {
                    "type": "object"
                },
                "test": {
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
            "required": [
                "test",
                "foo"
            ],
            "type": "object"
        });
    });
});