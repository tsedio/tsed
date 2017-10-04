import {OpenApiPropertiesBuilder} from "../../../../src/swagger/class/OpenApiPropertiesBuilder";
import {Description} from "../../../../src/swagger/decorators/description";
import {expect} from "../../../tools";
import {Foo2} from "./helpers/classes";

describe("OpenApiSchemaBuilder", () => {

    before(() => {
        this.schemaBuilder = new OpenApiPropertiesBuilder(Foo2);
        this.schemaBuilder.build();
    });

    it("should create a schema", () => {
        expect(this.schemaBuilder.schema).to.deep.eq({
            "title": "Foo2",
            "description": "Description Class",
            "type": "object",
            "properties": {
                "Name": {
                    "type": "string"
                },
                "ageModel": {
                    "$ref": "#/definitions/AgeModel"
                },
                "nameModel": {
                    "$ref": "#/definitions/NameModel"
                },
                "foo": {
                    "$ref": "#/definitions/Foo"
                },
                "dateStart": {
                    "type": "string"
                },
                "foos": {
                    "description": "Foo2.foos description",
                    "items": {
                        "$ref": "#/definitions/Foo"
                    },
                    "title": "Foo2.foos",
                    "type": "array"
                },
                "arrayOfString": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "test": {
                    "description": "Description test",
                    "title": "Test",
                    "type": "string"
                },
                "theMap": {
                    "additionalProperties": {
                        "$ref": "#/definitions/Foo"
                    },
                    "description": "Foo2.theMap description",
                    "title": "Foo2.theMap"
                },
                "theSet": {
                    "additionalProperties": {
                        "$ref": "#/definitions/Foo"
                    },
                    "description": "Foo2.theSet description",
                    "title": "Foo2.theSet"
                },
                "mapOfString": {
                    "additionalProperties": {
                        "type": "string"
                    }
                },
                "uint": {
                    "type": "number"
                }
            }
        });
    });

    it("should create a definitions", () => {
        expect(this.schemaBuilder.definitions).to.deep.eq({
            "Foo": {
                "properties": {
                    "foo": {
                        "description": "Description.foo",
                        "title": "Foo.foo",
                        "type": "object"
                    },
                    "test": {
                        "description": "Description.test",
                        "title": "Foo.test",
                        "type": "object"
                    }
                },
                "type": "object"
            },
            "Foo2": {
                "description": "Description Class",
                "properties": {
                    "Name": {
                        "type": "string"
                    },
                    "ageModel": {
                        "$ref": "#/definitions/AgeModel"
                    },
                    "nameModel": {
                        "$ref": "#/definitions/NameModel"
                    },
                    "foo": {
                        "$ref": "#/definitions/Foo"
                    },
                    "dateStart": {
                        "type": "string"
                    },
                    "foos": {
                        "description": "Foo2.foos description",
                        "items": {
                            "$ref": "#/definitions/Foo"
                        },
                        "title": "Foo2.foos",
                        "type": "array"
                    },
                    "arrayOfString": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "test": {
                        "description": "Description test",
                        "title": "Test",
                        "type": "string"
                    },
                    "theMap": {
                        "additionalProperties": {
                            "$ref": "#/definitions/Foo"
                        },
                        "description": "Foo2.theMap description",
                        "title": "Foo2.theMap"
                    },
                    "theSet": {
                        "additionalProperties": {
                            "$ref": "#/definitions/Foo"
                        },
                        "description": "Foo2.theSet description",
                        "title": "Foo2.theSet"
                    },
                    "mapOfString": {
                        "additionalProperties": {
                            "type": "string"
                        }
                    },
                    "uint": {
                        "type": "number"
                    }
                },
                "title": "Foo2",
                "type": "object"
            },
            "AgeModel": {
                "properties": {
                    "age": {
                        "description": "The age",
                        "title": "age",
                        "type": "number"
                    },
                    "id": {
                        "description": "Unique identifier.",
                        "title": "id",
                        "type": "string"
                    }
                },
                "type": "object"
            },
            "NameModel": {
                "properties": {
                    "name": {
                        "description": "The name",
                        "title": "name",
                        "type": "string"
                    },
                    "id": {
                        "description": "Unique identifier.",
                        "title": "id",
                        "type": "string"
                    }
                },
                "type": "object"
            }
        });
    });
});