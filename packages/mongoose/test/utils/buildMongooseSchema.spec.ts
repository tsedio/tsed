import {Store} from "@tsed/core";
import {JsonSchemesRegistry, PropertyRegistry} from "@tsed/common";
import {Schema} from "mongoose";
import {expect} from "chai";
import * as Sinon from "sinon";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {buildMongooseSchema, mapProps} from "../../src/utils/buildMongooseSchema";

describe("buildMongooseSchema", () => {
  describe("mapProps()", () => {
    it("should map a jsonSchema to mongoose schema", () => {
      expect(
        mapProps({
          pattern: "pattern",
          minimum: "minimum",
          maximum: "maximum",
          minLength: "minLength",
          maxLength: "maxLength",
          enum: ["value1", "value2"],
          default: "defaultValue"
        })
      ).to.deep.equal({
        match: new RegExp("pattern"),
        min: "minimum",
        max: "maximum",
        minlength: "minLength",
        maxlength: "maxLength",
        enum: ["value1", "value2"],
        default: "defaultValue"
      });
    });
  });

  describe("buildMongooseSchema()", () => {
    class Test {}

    describe("when property is a primitive", () => {
      before(() => {
        this.propertyMetadata = {
          type: String,
          required: true,
          isClass: false,
          store: {
            get: Sinon.stub().returns({minLength: 1})
          }
        };

        this.getPropertiesStub = Sinon.stub(PropertyRegistry, "getProperties").returns(
          new Map<string, any>([["test", this.propertyMetadata]])
        );

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
        this.propertyMetadata.store.get.should.have.been.calledWithExactly(MONGOOSE_SCHEMA);
      });

      it("should return a schema with property test", () => {
        expect(this.result.schema)
          .to.haveOwnProperty("test")
          .that.is.an("object");
        expect(this.result.schema.test)
          .to.haveOwnProperty("maxlength")
          .that.equals(9);
        expect(this.result.schema.test)
          .to.haveOwnProperty("minLength")
          .that.equals(1);
        expect(this.result.schema.test)
          .to.haveOwnProperty("required")
          .that.is.a("function");
        expect(this.result.schema.test)
          .to.haveOwnProperty("type")
          .that.equals(String);
      });

      it("should not have an _id", () => {
        expect(this.result.schema).to.not.haveOwnProperty("_id");
      });

      it("should have no virtuals", () => {
        expect(this.result.virtuals).to.be.empty;
      })
    });

    describe("when property is an array", () => {
      before(() => {
        this.propertyMetadata = {
          type: String,
          required: true,
          isArray: true,
          isCollection: true,
          isClass: false,
          store: {
            get: Sinon.stub().returns({minLength: 1})
          }
        };

        this.getPropertiesStub = Sinon.stub(PropertyRegistry, "getProperties").returns(
          new Map<string, any>([["test", this.propertyMetadata]])
        );

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
        this.propertyMetadata.store.get.should.have.been.calledWithExactly(MONGOOSE_SCHEMA);
      });

      it("should return a schema with property test", () => {
        expect(this.result.schema)
          .to.haveOwnProperty("test")
          .that.is.an("array")
          .that.have.lengthOf(1);
        expect(this.result.schema.test[0])
          .to.haveOwnProperty("maxlength")
          .that.equals(9);
        expect(this.result.schema.test[0])
          .to.haveOwnProperty("minLength")
          .that.equals(1);
        expect(this.result.schema.test[0])
          .to.haveOwnProperty("required")
          .that.is.a("function");
        expect(this.result.schema.test[0])
          .to.haveOwnProperty("type")
          .that.equals(String);
      });

      it("should not have an _id", () => {
        expect(this.result.schema).to.not.haveOwnProperty("_id");
      });

      it("should have no virtuals", () => {
        expect(this.result.virtuals).to.be.empty;
      })
    });

    describe("when property is a map", () => {
      before(() => {
        this.propertyMetadata = {
          type: String,
          required: true,
          isClass: false,
          isArray: false,
          isCollection: true,
          collectionType: Map,
          store: {
            get: Sinon.stub().returns({minLength: 1})
          }
        };

        this.getPropertiesStub = Sinon.stub(PropertyRegistry, "getProperties").returns(
          new Map<string, any>([["test", this.propertyMetadata]])
        );

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
        this.propertyMetadata.store.get.should.have.been.calledWithExactly(MONGOOSE_SCHEMA);
      });

      it("should return a schema with property test", () => {
        expect(this.result.schema)
          .to.haveOwnProperty("test")
          .that.is.an("object");
        expect(this.result.schema.test)
          .to.haveOwnProperty("type")
          .that.equals(Map);
        expect(this.result.schema.test)
          .to.haveOwnProperty("of")
          .that.is.an("object");
        expect(this.result.schema.test.of)
          .to.haveOwnProperty("type")
          .that.equals(String);
        expect(this.result.schema.test.of)
          .to.haveOwnProperty("maxlength")
          .that.equals(9);
        expect(this.result.schema.test.of)
          .to.haveOwnProperty("minLength")
          .that.equals(1);
        expect(this.result.schema.test.of)
          .to.haveOwnProperty("required")
          .that.is.a("function");
      });
      it("should not have an _id", () => {
        expect(this.result.schema).to.not.haveOwnProperty("_id");
      });

      it("should have no virtuals", () => {
        expect(this.result.virtuals).to.be.empty;
      })
    });

    describe("when property is a class", () => {
      class Children {}

      describe("when property is a subdocument", () => {
        before(() => {
          this.propertyMetadata = {
            type: Children,
            required: true,
            isClass: true,
            store: {
              get: Sinon.stub().returns(undefined)
            }
          };

          this.getPropertiesStub = Sinon.stub(PropertyRegistry, "getProperties")
            .onFirstCall()
            .returns(new Map<string, any>([["test", this.propertyMetadata], ["_id", {}]]))
            .onSecondCall()
            .returns(new Map<string, any>([["prop", this.innerPropertyMetadata], ["_id", {}]]));

          this.getSchemaDefinitionStub = Sinon.stub(JsonSchemesRegistry, "getSchemaDefinition")
            .onFirstCall()
            .returns({
              properties: {
                test: {}
              }
            });

          // @ts-ignore @types/sinon doesn't allow to use overrides with sinon.createStubInstance.
          this.storeResultStub = Sinon.createStubInstance(Store, {
            has: Sinon.stub().returns(true),
            get: Sinon.stub().returns("Schema")
          });

          this.storeFromStub = Sinon.stub(Store, "from").returns(this.storeResultStub);
          this.result = buildMongooseSchema(Test);
        });

        after(() => {
          this.getPropertiesStub.restore();
          this.getSchemaDefinitionStub.restore();
          this.storeFromStub.restore();
        });

        it("should call getProperties and returns a list of properties", () => {
          this.getPropertiesStub.should.have.been.calledWithExactly(Test);
          this.getPropertiesStub.should.not.have.been.calledWithExactly(Children);
        });

        it("should call store.get", () => {
          this.propertyMetadata.store.get.should.have.been.calledWithExactly(MONGOOSE_SCHEMA);
        });

        it("should return a schema with property test", () => {
          expect(this.result.schema)
            .to.haveOwnProperty("test")
            .that.is.an("object");
          expect(this.result.schema.test)
            .to.haveOwnProperty("required")
            .that.is.a("function");
          expect(this.result.schema.test)
            .to.haveOwnProperty("type")
            .that.equals("Schema");
        });

        it("should not have an _id", () => {
          expect(this.result.schema).to.not.haveOwnProperty("_id");
        });

        it("should have no virtuals", () => {
          expect(this.result.virtuals).to.be.empty;
        })
      });

      describe("when property is a reference class", () => {
        before(() => {
          this.propertyMetadata = {
            type: Children,
            required: true,
            isClass: true,
            store: {
              get: Sinon.stub().returns({
                type: Schema.Types.ObjectId,
                ref: "Children"
              })
            }
          };

          this.innerPropertyMetadata = {
            type: String,
            required: false,
            isClass: false,
            isArray: true,
            store: {
              get: Sinon.stub().returns(undefined)
            }
          };

          this.getPropertiesStub = Sinon.stub(PropertyRegistry, "getProperties")
            .onFirstCall()
            .returns(new Map<string, any>([["test", this.propertyMetadata], ["_id", {}]]))
            .onSecondCall()
            .returns(new Map<string, any>([["prop", this.innerPropertyMetadata], ["_id", {}]]));

          this.getSchemaDefinitionStub = Sinon.stub(JsonSchemesRegistry, "getSchemaDefinition")
            .onFirstCall()
            .returns({
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
          this.getPropertiesStub.should.not.have.been.calledWithExactly(Children);
        });

        it("should call store.get", () => {
          this.propertyMetadata.store.get.should.have.been.calledWithExactly(MONGOOSE_SCHEMA);
        });

        it("should return a schema with property test", () => {
          expect(this.result.schema)
            .to.haveOwnProperty("test")
            .that.is.an("object");
          expect(this.result.schema.test)
            .to.haveOwnProperty("type")
            .that.equals(Schema.Types.ObjectId);
          expect(this.result.schema.test)
            .to.haveOwnProperty("ref")
            .that.equals("Children");
          expect(this.result.schema.test)
            .to.haveOwnProperty("required")
            .that.is.a("function");
          expect(this.result.schema.test).to.not.haveOwnProperty("prop");
        });

        it("should not have an _id", () => {
          expect(this.result.schema).to.not.haveOwnProperty("_id");
        });

        it("should have no virtuals", () => {
          expect(this.result.virtuals).to.be.empty;
        })
      });

      describe("when property is a virtual reference", () => {
        before(() => {
          this.propertyMetadata = {
            type: Children,
            isClass: false,
            isArray: true,
            store: {
              get: Sinon.stub().returns({
                ref: "Children",
                localField: "_id",
                foreignField: "tester",
                justOne: false
              })
            }
          };

          this.reversePropertyMetadata = {
            type: Test,
            required: true,
            isClass: true,
            store: {
              get: Sinon.stub().returns({
                type: Schema.Types.ObjectId,
                ref: "Test"
              })
            }
          };

          this.innerPropertyMetadata = {
            type: String,
            required: false,
            isClass: false,
            isArray: true,
            store: {
              get: Sinon.stub().returns(undefined)
            }
          };

          this.getPropertiesStub = Sinon.stub(PropertyRegistry, "getProperties")
            .onFirstCall()
            .returns(new Map<string, any>([["test", this.propertyMetadata], ["_id", {}]]))
            .onSecondCall()
            .returns(new Map<string, any>([["tester", this.reversePropertyMetadata], ["prop", this.innerPropertyMetadata], ["_id", {}]]));

          this.getSchemaDefinitionStub = Sinon.stub(JsonSchemesRegistry, "getSchemaDefinition")
            .onFirstCall()
            .returns({
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
          this.propertyMetadata.store.get.should.have.been.calledWithExactly(MONGOOSE_SCHEMA);
        });

        it("should return a schema without property test", () => {
          expect(this.result.schema).to.not.haveOwnProperty("test");
        });

        it("should not have an _id", () => {
          expect(this.result.schema).to.not.haveOwnProperty("_id");
        });

        it("should have a test virtual", () => {
          expect(this.result.virtuals).to.have.key("test");
        })
      });
    });
  });
});
