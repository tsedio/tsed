import * as Proxyquire from "proxyquire";
import {BodyParamsFilter} from "../../../../src/filters/components/BodyParamsFilter";
import {ParamMetadata} from "../../../../src/mvc/class/ParamMetadata";
import {Description} from "../../../../src/swagger/decorators/description";
import {expect, Sinon} from "../../../tools";
import {Ctrl, Foo, Foo2} from "./helpers/classes";

const param0 = new ParamMetadata(Ctrl, "test", 0);
param0.service = BodyParamsFilter;
param0.type = Foo2;

const getParams = Sinon.stub().returns([param0]);

const {OpenApiParamsBuilder} = Proxyquire("../../../../src/swagger/class/OpenApiParamsBuilder", {
    "../../mvc/registries/ParamRegistry": {
        ParamRegistry: {
            getParams
        }
    }
});

describe("OpenApiParamsBuilder", () => {

    before(() => {
        this.builder = new OpenApiParamsBuilder(Ctrl, "test");
        this.builder.build();
    });

    it("should create a schema", () => {
        expect(this.builder.parameters).to.deep.eq([
            {
                "description": "",
                "in": "body",
                "name": "body",
                "required": false,
                "schema": {
                    "$ref": "#/definitions/Foo2"
                }
            }
        ]);
    });

    it("should create a definitions", () => {
        expect(this.builder.definitions).to.deep.eq({
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
            }
        });
    });
});