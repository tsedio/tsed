import {JsonSchema, JsonSchemesRegistry, PropertyRegistry} from "@tsed/common";
import {Store} from "@tsed/core";
import {OpenApiModelSchemaBuilder} from "../../../../src/swagger/class/OpenApiModelSchemaBuilder";
import {Description} from "../../../../src/swagger/decorators/description";
import {expect, Sinon} from "../../../tools";
import {ChildModelB, SwaFoo2, SwaNoDecoModel} from "./helpers/classes";

describe("OpenApiModelSchemaBuilder", () => {

    describe("integration", () => {
        before(() => {
            this.schemaBuilder = new OpenApiModelSchemaBuilder(SwaFoo2);
            this.schemaBuilder.build();
        });

        it("should not fail", () => {
            let builder = new OpenApiModelSchemaBuilder(SwaNoDecoModel);

            let build = () => {
                builder.build();
            };

            expect(build).to.not.throw();
        });

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
                        "example": "TODO",
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
                    "mapAny": {
                        "additionalProperties": {
                            "type": [
                                "integer",
                                "number",
                                "string",
                                "boolean",
                                "array",
                                "object",
                                "null"
                            ]
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
                            "example": "TODO",
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

                        "mapAny": {
                            "additionalProperties": {
                                "type": [
                                    "integer",
                                    "number",
                                    "string",
                                    "boolean",
                                    "array",
                                    "object",
                                    "null"
                                ]
                            }
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

    describe("inheritance integration", () => {
        before(() => {
            this.schemaBuilder = new OpenApiModelSchemaBuilder(ChildModelB);
            this.schemaBuilder.build();
        });

        it("should create a schema", () => {
            expect(this.schemaBuilder.schema).to.deep.eq({
                "properties": {
                    "childPropertyB": {
                        "type": "string"
                    },
                    "parentProperty": {
                        "type": "string"
                    }
                },
                "required": [
                    "parentProperty",
                    "childPropertyB"
                ],
                "type": "object"
            });
        });
    });

    describe("build()", () => {
        before(() => {

            this.getPropertiesStub = Sinon.stub(PropertyRegistry, "getProperties")
                .returns([
                    {name: "test"},
                    {propertyKey: "test2"}
                ]);
            this.storeStub = Sinon.stub(Store, "from").returns({
                get: Sinon.stub().returns("description")
            });

            this.schemaBuilder = new OpenApiModelSchemaBuilder(SwaFoo2);
            Sinon.stub(this.schemaBuilder, "getClassSchema").returns({schema: "classSchema", required: true});
            Sinon.stub(this.schemaBuilder, "createSchema").returns({schema: "schema"});

            this.schemaBuilder.build();
        });

        after(() => {
            this.getPropertiesStub.restore();
            this.storeStub.restore();
        });

        it("should call the getProperties method with the right parameters", () => {
            this.getPropertiesStub.should.have.been.calledWithExactly(SwaFoo2);
        });

        it("should call the getClassSchema method with the right parameters", () => {
            this.schemaBuilder.getClassSchema.should.have.been.calledWithExactly();
        });

        it("should call the createSchema method with the right parameters", () => {
            this.schemaBuilder.createSchema.should.have.been.calledWithExactly({name: "test"});
            this.schemaBuilder.createSchema.should.have.been.calledWithExactly({propertyKey: "test2"});
        });

        it("should build the schema", () => {
            expect(this.schemaBuilder.schema).to.deep.equal({
                "description": "description",
                "properties": {
                    "test": {
                        "schema": "schema"
                    },
                    "test2": {
                        "schema": "schema"
                    }
                },
                "required": true,
                "schema": "classSchema",
                "type": "object"
            });
        });
    });

    describe("createSchema()", () => {
        before(() => {

        });
    });

    describe("getClassSchema()", () => {
        before(() => {
            this.registryStub = Sinon.stub(JsonSchemesRegistry, "getSchemaDefinition").returns({type: "string"});
            this.schemaBuilder = new OpenApiModelSchemaBuilder(SwaFoo2);
            this.result = this.schemaBuilder.getClassSchema();
        });

        after(() => {
            this.registryStub.restore();
        });

        it("should call getSchemaDefinition", () => {
            this.registryStub.should.have.been.calledWithExactly(SwaFoo2);
        });
        it("should return the schema", () => {
            expect(this.result).to.deep.eq({type: "string"});
        });
    });

    describe("createSchema", () => {

        describe("when the model is a primitive", () => {
            before(() => {
                this.jsonSchema = new JsonSchema();

                this.propertyMetadata = {
                    type: String,
                    isClass: false,
                    store: {
                        get: Sinon.stub().returns(this.jsonSchema)
                    }
                };

                this.schemaBuilder = new OpenApiModelSchemaBuilder(class Test {
                });
                this.result = this.schemaBuilder.createSchema(this.propertyMetadata);
            });

            it("should return the schema", () => {
                expect(this.result).to.deep.equal({
                    "type": "string"
                });
            });

            it("should add a Schema to the definitions fields", () => {
                expect(this.schemaBuilder.definitions).to.deep.equal({});
            });
        });

        describe("when the model is a class", () => {
            before(() => {
                this.jsonSchema = new JsonSchema();
                this.jsonSchema.type = "object";

                this.propertyMetadata = {
                    type: class Test2 {
                    },
                    typeName: "Test2",
                    isClass: true,
                    store: {
                        get: Sinon.stub().returns(this.jsonSchema)
                    }
                };

                this.schemaBuilder = new OpenApiModelSchemaBuilder(class Test {
                });
                this.result = this.schemaBuilder.createSchema(this.propertyMetadata);
            });

            it("should return the schema", () => {
                expect(this.result).to.deep.equal({
                    "$ref": "#/definitions/Test2"
                });
            });

            it("should add a Schema to the definitions fields", () => {
                expect(this.schemaBuilder.definitions).to.deep.equal({
                    "Test2": {
                        "properties": {},
                        "type": "object"
                    }
                });
            });
        });

        describe("when the model is a collection (string[])", () => {
            before(() => {
                this.jsonSchema = new JsonSchema();

                this.propertyMetadata = {
                    type: String,
                    isCollection: true,
                    isArray: true,
                    isClass: false,
                    store: {
                        get: Sinon.stub().returns(this.jsonSchema)
                    }
                };

                this.schemaBuilder = new OpenApiModelSchemaBuilder(class Test {
                });
                this.result = this.schemaBuilder.createSchema(this.propertyMetadata);
            });

            it("should return the schema", () => {
                expect(this.result).to.deep.equal({
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                });
            });

            it("should add a Schema to the definitions fields", () => {
                expect(this.schemaBuilder.definitions).to.deep.equal({});
            });
        });

        describe("when the model is a collection (Class[])", () => {
            before(() => {
                this.jsonSchema = new JsonSchema();

                this.propertyMetadata = {
                    type: class Test2 {
                    },
                    typeName: "Test2",
                    isArray: true,
                    isClass: true,
                    isCollection: true,
                    store: {
                        get: Sinon.stub().returns(this.jsonSchema)
                    }
                };

                this.schemaBuilder = new OpenApiModelSchemaBuilder(class Test {
                });
                this.result = this.schemaBuilder.createSchema(this.propertyMetadata);
            });

            it("should return the schema", () => {
                expect(this.result).to.deep.equal({
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Test2"
                    }
                });
            });

            it("should add a Schema to the definitions fields", () => {
                expect(this.schemaBuilder.definitions).to.deep.equal({
                    "Test2": {
                        "properties": {},
                        "type": "object"
                    }
                });
            });
        });

    });
});