import * as Proxyquire from "proxyquire";
import {JsonProperty} from "../../../../src/converters/decorators/jsonProperty";
import {BodyParamsFilter} from "../../../../src/filters/components/BodyParamsFilter";
import {ParamMetadata} from "../../../../src/mvc/class/ParamMetadata";
import {Required} from "../../../../src/mvc/decorators/required";
import {Description} from "../../../../src/swagger/decorators/description";
import {Title} from "../../../../src/swagger/decorators/title";
import {expect, Sinon} from "../../../tools";

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

    @JsonProperty({use: String})
    mapOfString: Map<string, string>;

    @JsonProperty({use: String})
    arrayOfString: string[];

    method() {

    }
}

class Foo3 {
    toJSON() {
        return {};
    }
}

class Ctrl {

}

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