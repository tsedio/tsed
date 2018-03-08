import {JsonSchemesRegistry, PropertyRegistry} from "@tsed/common";
import {buildMongooseSchema, mapProps} from "../../../../src/mongoose/utils/buildMongooseSchema";
import {expect, Sinon} from "../../../tools";

describe("buildMongooseSchema", () => {

    describe("mapProps()", () => {
        it("should map a jsonSchema to mongoose schema", () => {
            expect(mapProps({
                pattern: "pattern",
                minimum: "minimum",
                maximum: "maximum",
                minLength: "minLength",
                maxLength: "maxLength",
                "enum": ["value1", "value2"],
                "default": "defaultValue"
            })).to.deep.equal({
                match: new RegExp("pattern"),
                min: "minimum",
                max: "maximum",
                minlength: "minLength",
                maxlength: "maxLength",
                "enum": ["value1", "value2"],
                "default": "defaultValue"
            });
        });
    });

    describe("buildMongooseSchema()", () => {

        describe("when property is not a class", () => {
            class Test {

            }

            before(() => {
                this.propertyMetadata = {
                    type: String,
                    required: true,
                    isClass: false,
                    store: {
                        get: Sinon.stub().returns({minLength: 1})
                    }
                };

                const map = new Map();
                map.set("test", this.propertyMetadata);

                this.getPropertiesStub = Sinon.stub(PropertyRegistry, "getProperties").returns(map);

                this.getSchemaDefinitionStub = Sinon.stub(JsonSchemesRegistry, "getSchemaDefinition").returns({
                    properties: {
                        test: {
                            maxLength: 9
                        }
                    }
                });

                this.result = buildMongooseSchema(Test);
            });
            after(() => {
                this.getPropertiesStub.restore();
                this.getSchemaDefinitionStub.restore();
            });

            it("should call getProperties and returns a list of properties", () => {
                this.getPropertiesStub.should.have.been.calledWithExactly(Test);
            });

            it("should call store.get", () => {
                this.propertyMetadata.store.get.should.have.been.calledWithExactly("mongooseSchema");
            });

            it("should return a schema", () => {
                expect(this.result).to.deep.eq({
                    test: {
                        "maxlength": 9,
                        "minLength": 1,
                        "required": true,
                        "type": String
                    }
                });
            });
        });
        describe("when property is a class", () => {
            class Test {

            }

            class Children {

            }

            before(() => {
                this.propertyMetadata = {
                    type: Children,
                    required: true,
                    isClass: true,
                    store: {
                        get: Sinon.stub().returns(undefined)
                    }
                };

                const map = new Map();
                map.set("test", this.propertyMetadata);

                const map2 = new Map();
                map2.set("test2", {
                    type: String,
                    required: false,
                    isClass: false,
                    isArray: true,
                    store: {
                        get: Sinon.stub().returns(undefined)
                    }
                });

                this.getPropertiesStub = Sinon.stub(PropertyRegistry, "getProperties")
                    .onFirstCall().returns(map)
                    .onSecondCall().returns(map2);

                this.getSchemaDefinitionStub = Sinon.stub(JsonSchemesRegistry, "getSchemaDefinition")
                    .onFirstCall().returns({
                        properties: {
                            test: {}
                        }
                    });

                this.result = buildMongooseSchema(Test);
            });
            after(() => {
                this.getPropertiesStub.restore();
                this.getSchemaDefinitionStub.restore();
            });

            it("should call getProperties and returns a list of properties", () => {
                this.getPropertiesStub.should.have.been.calledWithExactly(Test);
            });

            it("should call store.get", () => {
                this.propertyMetadata.store.get.should.have.been.calledWithExactly("mongooseSchema");
            });

            it("should return a schema", () => {
                expect(this.result).to.deep.eq({
                    "test": {
                        "required": true,
                        "test2": [
                            {
                                "type": String
                            }
                        ]
                    }
                });
            });
        });

    });
});