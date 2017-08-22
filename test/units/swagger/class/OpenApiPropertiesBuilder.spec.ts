import {JsonProperty} from "../../../../src/converters/decorators/jsonProperty";
import {Required} from "../../../../src/mvc/decorators/required";
import {OpenApiPropertiesBuilder} from "../../../../src/swagger/class/OpenApiPropertiesBuilder";
import {Description} from "../../../../src/swagger/decorators/description";
import {Title} from "../../../../src/swagger/decorators/title";
import {expect} from "../../../tools";

class Foo {
    @Title("Foo.test")
    @Description("Description.test")
    test: any;

    @Title("Foo.foo")
    @Description("Description.foo")
    foo: any;

    method() {
    }
}

@Title("Foo2")
@Description("Description Class")
class Foo2 {

    @Title("Test")
    @Description("Description test")
    @JsonProperty()
    @Required()
    test: string = "";

    @JsonProperty("Name")
    name: string;

    @JsonProperty()
    dateStart: Date;

    @JsonProperty()
    uint: number;

    object: any;

    @JsonProperty()
    foo: Foo;

    @Title("Foo2.foos")
    @Description("Foo2.foos description")
    @JsonProperty({use: Foo})
    foos: Foo[];

    @Title("Foo2.theMap")
    @Description("Foo2.theMap description")
    @JsonProperty({use: Foo})
    theMap: Map<string, Foo>;

    @Title("Foo2.theSet")
    @Description("Foo2.theSet description")
    @JsonProperty({use: Foo})
    theSet: Set<Foo>;

    method() {

    }
}

class Foo3 {
    toJSON() {
        return {};
    }
}


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
                "test": {
                    "type": "string",
                    "title": "Test",
                    "description": "Description test"
                },
                "Name": {
                    "type": "string"
                },
                "dateStart": {
                    "type": "string"
                },
                "uint": {
                    "type": "number"
                },
                "foo": {
                    "$ref": "#/definitions/Foo"
                },
                "foos": {
                    "description": "Foo2.foos description",
                    "items": {
                        "$ref": "#/definitions/Foo"
                    },
                    "title": "Foo2.foos",
                    "type": "array"
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
                    "dateStart": {
                        "type": "string"
                    },
                    "foo": {
                        "$ref": "#/definitions/Foo"
                    },
                    "foos": {
                        "description": "Foo2.foos description",
                        "items": {
                            "$ref": "#/definitions/Foo"
                        },
                        "title": "Foo2.foos",
                        "type": "array"
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