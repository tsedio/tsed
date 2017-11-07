import {OpenApiPropertiesBuilder} from "../../../../src/swagger/class/OpenApiPropertiesBuilder";
import {Description} from "../../../../src/swagger/decorators/description";
import {expect} from "../../../tools";
import { SwaFoo2, SwaNoDecoModel } from './helpers/classes';

describe("OpenApiPropertiesBuilder", () => {

    before(() => {
        this.schemaBuilder = new OpenApiPropertiesBuilder(SwaFoo2);
        this.schemaBuilder.build();
    });

    it("should not fail", ()=> {
        let builder = new OpenApiPropertiesBuilder(SwaNoDecoModel);
        
        let build = () => {builder.build();}
           
        expect(build).to.not.throw();
    })


    it("should create a schema", () => {
        expect(this.schemaBuilder.schema).to.deep.eq({
            "title": "SwaFoo2",
            "description": "Description Class",
            "type": "object",
            "required": [
                "test"
            ],
            "properties": {
                "Name": {
                    "type": "string"
                },
                "ageModel": {
                    "$ref": "#/definitions/SwaAgeModel"
                },
                "nameModel": {
                    "$ref": "#/definitions/SwaNameModel"
                },
                "foo": {
                    "$ref": "#/definitions/SwaFoo"
                },
                "dateStart": {
                    "type": "string"
                },
                "foos": {
                    "description": "SwaFoo2.foos description",
                    "items": {
                        "$ref": "#/definitions/SwaFoo"
                    },
                    "title": "SwaFoo2.foos",
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
                        "$ref": "#/definitions/SwaFoo"
                    },
                    "description": "SwaFoo2.theMap description",
                    "title": "SwaFoo2.theMap"
                },
                "theSet": {
                    "additionalProperties": {
                        "$ref": "#/definitions/SwaFoo"
                    },
                    "description": "SwaFoo2.theSet description",
                    "title": "SwaFoo2.theSet"
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
            "SwaFoo": {
                "properties": {
                    "foo": {
                        "description": "Description.foo",
                        "title": "SwaFoo.foo",
                        "type": "object"
                    },
                    "test": {
                        "description": "Description.test",
                        "title": "SwaFoo.test",
                        "type": "object"
                    }
                },
                "type": "object"
            },
            "SwaFoo2": {
                "description": "Description Class",
                "required": [
                    "test"
                ],
                "properties": {
                    "Name": {
                        "type": "string"
                    },
                    "ageModel": {
                        "$ref": "#/definitions/SwaAgeModel"
                    },
                    "nameModel": {
                        "$ref": "#/definitions/SwaNameModel"
                    },
                    "foo": {
                        "$ref": "#/definitions/SwaFoo"
                    },
                    "dateStart": {
                        "type": "string"
                    },
                    "foos": {
                        "description": "SwaFoo2.foos description",
                        "items": {
                            "$ref": "#/definitions/SwaFoo"
                        },
                        "title": "SwaFoo2.foos",
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
                            "$ref": "#/definitions/SwaFoo"
                        },
                        "description": "SwaFoo2.theMap description",
                        "title": "SwaFoo2.theMap"
                    },
                    "theSet": {
                        "additionalProperties": {
                            "$ref": "#/definitions/SwaFoo"
                        },
                        "description": "SwaFoo2.theSet description",
                        "title": "SwaFoo2.theSet"
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
                "title": "SwaFoo2",
                "type": "object"
            },
            "SwaAgeModel": {
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
            "SwaNameModel": {
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