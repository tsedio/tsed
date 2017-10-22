import {JsonSchemesRegistry} from "../../../../src/jsonschema/registries/JsonSchemesRegistry";
import {JsonFoo2} from "../../../helper/classes";
import {expect} from "../../../tools";


const j = (o: any): any => JSON.parse(JSON.stringify(o));

describe("JsonSchemesRegistry", () => {
    describe("property()", () => {
        it("should have created a schema for Foo2", () => {
            expect(j(JsonSchemesRegistry.get(JsonFoo2))).to.deep.eq({
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
                        "$ref": "#/definitions/JsonFoo"
                    },
                    "foos": {
                        "items": {
                            "$ref": "#/definitions/JsonFoo"
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
                            "$ref": "#/definitions/JsonFoo"
                        }
                    },
                    "theSet": {
                        "additionalProperties": {
                            "$ref": "#/definitions/JsonFoo"
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
});