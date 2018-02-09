import * as Proxyquire from "proxyquire";
import {ParamMetadata} from "../../../../src/common/filters/class/ParamMetadata";
import {BodyParamsFilter} from "../../../../src/common/filters/components/BodyParamsFilter";
import {Description} from "../../../../src/swagger/decorators/description";
import {expect, Sinon} from "../../../tools";
import {Ctrl, SwaFoo2} from "./helpers/classes";

const param0 = new ParamMetadata(Ctrl, "test", 0);
param0.service = BodyParamsFilter;
param0.type = SwaFoo2;

const getParams = Sinon.stub().returns([param0]);

const {OpenApiParamsBuilder} = Proxyquire("../../../../src/swagger/class/OpenApiParamsBuilder", {
    "../../common/filters/registries/ParamRegistry": {
        ParamRegistry: {
            getParams
        }
    }
});

describe("OpenApiParamsBuilder", () => {

    describe("createPropertiesFromExpression()", () => {
        describe("when the expression is given 't1.t2.t3'", () => {
            before(() => {
                this.builder = new OpenApiParamsBuilder(Ctrl, "test");

                this.result = this.builder.createSchemaFromExpression("t1.t2.t3");
            });

            it("should create a schema", () => {
                expect(this.result).to.deep.eq({
                    "currentProperty": {},
                    "schema": {
                        "properties": {
                            "t1": {
                                "properties": {
                                    "t2": {
                                        "properties": {
                                            "t3": {}
                                        },
                                        "type": "object"
                                    }
                                },
                                "type": "object"
                            }
                        },
                        "type": "object"
                    }
                });
            });
        });


        describe("when the expression is given 'event'", () => {
            before(() => {
                this.builder = new OpenApiParamsBuilder(Ctrl, "test");

                this.result = this.builder.createSchemaFromExpression("event");
            });

            it("should create a schema", () => {
                expect(this.result).to.deep.eq({
                    "currentProperty": {},
                    "schema": {
                        "properties": {
                            "event": {}
                        },
                        "type": "object"
                    }
                });
            });
        });

        describe("when the expression is not given", () => {
            before(() => {
                this.builder = new OpenApiParamsBuilder(Ctrl, "test");

                this.result = this.builder.createSchemaFromExpression();
            });

            it("should create a schema", () => {
                expect(this.result).to.deep.eq({
                    "currentProperty": {},
                    "schema": {}
                });
            });
        });
    });

    describe("createSchema()", () => {
        describe("when is a string", () => {
            before(() => {
                this.builder = new OpenApiParamsBuilder(Ctrl, "test");

                this.result = this.builder.createSchema({
                    expression: "t1.t2.t3",
                    type: String,
                    isClass: false,
                    isCollection: false,
                    store: {
                        get: () => {
                        }
                    }
                });
            });

            it("should create a schema", () => {
                expect(this.result).to.deep.eq({
                    "properties": {
                        "t1": {
                            "properties": {
                                "t2": {
                                    "properties": {
                                        "t3": {
                                            "type": "string"
                                        }
                                    },
                                    "type": "object"
                                }
                            },
                            "type": "object"
                        }
                    },
                    "type": "object"
                });
            });
        });

        describe("when is a string[]", () => {
            before(() => {
                this.builder = new OpenApiParamsBuilder(Ctrl, "test");

                this.result = this.builder.createSchema({
                    expression: "event",
                    type: String,
                    isClass: false,
                    isCollection: true,
                    store: {
                        get: () => {
                        }
                    }
                });
            });

            it("should create a schema", () => {
                expect(this.result).to.deep.eq({
                    "properties": {
                        "event": {
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "type": "object"
                });
            });
        });

        describe("when is a Test", () => {
            class Test {
            }

            before(() => {
                this.builder = new OpenApiParamsBuilder(Ctrl, "test");

                this.result = this.builder.createSchema({
                    expression: "event",
                    type: Test,
                    isClass: true,
                    isCollection: false,
                    typeName: "Test",
                    store: {
                        get: () => Test

                    }
                });
            });

            it("should create a schema", () => {
                expect(this.result).to.deep.eq({
                    "properties": {
                        "event": {
                            "$ref": "#/definitions/Test"
                        }
                    },
                    "type": "object"
                });
            });
        });

    });

    describe("integration", () => {

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
                        "$ref": "#/definitions/SwaFoo2"
                    }
                }
            ]);
        });

        it("should create a definitions", () => {
            expect(this.builder.definitions).to.deep.eq({
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
                    "properties": {
                        "Name": {
                            "type": "string"
                        },
                        "ageModel": {
                            "$ref": "#/definitions/SwaAgeModel"
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
                            "$ref": "#/definitions/SwaFoo"
                        },
                        "foos": {
                            "description": "SwaFoo2.foos description",
                            "items": {
                                "$ref": "#/definitions/SwaFoo"
                            },
                            "title": "SwaFoo2.foos",
                            "type": "array"
                        },
                        "mapOfString": {
                            "additionalProperties": {
                                "type": "string"
                            }
                        },
                        "nameModel": {
                            "$ref": "#/definitions/SwaNameModel"
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
                        "uint": {
                            "type": "number"
                        }
                    },
                    "required": [
                        "test"
                    ],
                    "title": "SwaFoo2",
                    "type": "object"
                },
                "SwaNameModel": {
                    "properties": {
                        "id": {
                            "description": "Unique identifier.",
                            "title": "id",
                            "type": "string"
                        },
                        "name": {
                            "description": "The name",
                            "title": "name",
                            "type": "string"
                        }
                    },
                    "type": "object"
                }
            });
        });
    });

});