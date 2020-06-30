import {MinLength, ParamMetadata, ParamTypes, Property, Required} from "@tsed/common";
import {BodyParams} from "@tsed/common/src/mvc/decorators/params/bodyParams";
import {QueryParams} from "@tsed/common/src/mvc/decorators/params/queryParams";
import {MultipartFile} from "@tsed/multipartfiles/src";
import {expect} from "chai";
import * as Sinon from "sinon";
import {Ctrl, SwaFoo2} from "../../test/helpers/class/classes";
import {Consumes, Description} from "../index";
import {OpenApiParamsBuilder} from "./OpenApiParamsBuilder";

const param0 = new ParamMetadata({target: Ctrl, propertyKey: "test", index: 0});
param0.paramType = ParamTypes.BODY;
param0.type = SwaFoo2;

const sandbox = Sinon.createSandbox();
describe("OpenApiParamsBuilder", () => {
  describe("build()", () => {
    describe("when consumes has application/x-www-form-urlencoded", () => {
      it("should set hasFromData to true", () => {
        class Ctrl {
          @Consumes("application/x-www-form-urlencoded")
          test(@BodyParams("expression") param: string) {}
        }

        const builder = new OpenApiParamsBuilder(Ctrl, "test").build();

        // @ts-ignore
        expect(builder.hasFormData).to.equal(true);
        expect(builder.parameters).to.deep.equal([
          {
            in: "formData",
            name: "expression",
            required: false,
            type: "string"
          }
        ]);
      });
    });
    describe("when consumes does not have application/x-www-form-urlencoded", () => {
      it("should set hasFromData to false", () => {
        class Ctrl {
          @Consumes("application/json")
          test(@BodyParams("expression") param: string) {}
        }

        const builder = new OpenApiParamsBuilder(Ctrl, "test").build();

        // @ts-ignore
        expect(builder.hasFormData).to.equal(false);
        expect(builder.parameters).to.deep.equal([
          {
            description: "",
            in: "body",
            name: "body",
            required: false,
            schema: {
              $ref: "#/definitions/CtrlTestPayload"
            }
          }
        ]);
      });
    });
    describe("when formData", () => {
      it("should concat results", () => {
        class Ctrl {
          @Consumes("application/x-www-form-urlencoded")
          test(@MultipartFile("expression1") param1: string, @BodyParams("expression2") param2: string) {}
        }

        const builder = new OpenApiParamsBuilder(Ctrl, "test");

        // @ts-ignore
        Sinon.stub(builder, "getInHeaders").returns("getInHeaders");
        // @ts-ignore
        Sinon.stub(builder, "getInPathParams").returns("getInPathParams");
        // @ts-ignore
        Sinon.stub(builder, "getInQueryParams").returns("getInQueryParams");
        // @ts-ignore
        Sinon.stub(builder, "getInFormData").returns("getInFormData");
        // @ts-ignore
        Sinon.stub(builder, "getInBodyParam").returns("getInBodyParam");

        builder.build();

        expect(builder.parameters).to.deep.equal(["getInHeaders", "getInPathParams", "getInQueryParams", "getInFormData"]);
      });
    });
  });

  describe("getInQueryParams()", function test() {
    before(() => {
      const storeGet = (key: string) => {
        if (key === "hidden") {
          return false;
        }

        return {test: "test"};
      };

      this.params = [
        {
          paramType: ParamTypes.QUERY,
          expression: "expression1",
          required: true,
          store: {
            get: storeGet
          }
        },
        {
          paramType: ParamTypes.PATH,
          store: {
            get: storeGet
          }
        },
        {
          paramType: ParamTypes.QUERY,
          expression: "expression2",
          required: false,
          store: {
            get: storeGet
          }
        }
      ];

      this.getParamsStub = Sinon.stub(ParamMetadata, "getParams").returns(this.params);

      this.builder = new OpenApiParamsBuilder(Ctrl, "test");
      Sinon.stub(this.builder, "addResponse400");
      Sinon.stub(this.builder, "createSchemaFromQueryParam").returns([{type: "string"}]);

      this.result = this.builder.getInQueryParams();
    });
    after(() => {
      this.getParamsStub.restore();
    });

    it("should call createSchemaFromQueryParam()", () => {
      expect(this.builder.createSchemaFromQueryParam).to.have.callCount(2);
      expect(this.builder.createSchemaFromQueryParam).to.have.calledWithExactly(this.params[0]);
      expect(this.builder.createSchemaFromQueryParam).to.have.calledWithExactly(this.params[2]);
    });

    it("should return data", () => {
      expect(this.result).to.deep.equal([
        {
          in: "query",
          name: "expression1",
          required: true,
          test: "test",
          type: "string"
        },
        {
          in: "query",
          name: "expression2",
          required: false,
          test: "test",
          type: "string"
        }
      ]);
    });
  });

  describe("getInPathParams()", () => {
    before(() => {
      const storeGet = (key: string) => {
        if (key === "hidden") {
          return false;
        }

        return {test: "test"};
      };

      this.params = [
        {
          paramType: ParamTypes.PATH,
          expression: "expression1",
          required: true,
          type: String,
          store: {
            get: storeGet
          }
        },
        {
          paramType: ParamTypes.QUERY,
          expression: "expression2",
          required: false,
          store: {
            get: storeGet
          }
        }
      ];

      this.getParamsStub = Sinon.stub(ParamMetadata, "getParams").returns(this.params);

      this.builder = new OpenApiParamsBuilder(Ctrl, "test", [
        {
          in: "path",
          type: "string",
          name: "expression1",
          required: true
        },
        {
          in: "path",
          type: "string",
          name: "test",
          required: true
        }
      ]);

      this.result = this.builder.getInPathParams();
    });
    after(() => {
      this.getParamsStub.restore();
    });

    it("should return data", () => {
      expect(this.result).to.deep.equal([
        {
          in: "path",
          name: "expression1",
          required: true,
          test: "test",
          type: "string"
        },
        {
          in: "path",
          name: "test",
          required: true,
          type: "string"
        }
      ]);
    });
  });

  describe("getInFormData()", () => {
    before(() => {
      const storeGet = (key: string) => {
        if (key === "hidden") {
          return false;
        }

        return {test: "test"};
      };

      this.params = [
        {
          paramType: ParamTypes.BODY,
          expression: "expression1",
          required: true,
          type: String,
          store: {
            get: storeGet
          }
        },
        {
          paramType: ParamTypes.FORM_DATA,
          expression: "expression2.0",
          required: false,
          store: {
            get: storeGet
          }
        }
      ];

      this.getParamsStub = Sinon.stub(ParamMetadata, "getParams").returns(this.params);

      this.builder = new OpenApiParamsBuilder(Ctrl, "test");

      this.result = this.builder.getInFormData();
    });
    after(() => {
      this.getParamsStub.restore();
    });

    it("should return data", () => {
      expect(this.result).to.deep.equal([
        {
          in: "formData",
          name: "expression1",
          required: true,
          test: "test",
          type: "string"
        },
        {
          in: "formData",
          name: "expression2",
          required: false,
          test: "test",
          type: "file"
        }
      ]);
    });
  });

  describe("getInFormData()", () => {
    describe("when model", () => {
      it("should return data", () => {
        class Model {
          @Property()
          prop: string;
        }

        class Ctrl {
          test(@BodyParams() @Required() @Description("Description") model: Model) {}
        }

        const builder = new OpenApiParamsBuilder(Ctrl, "test").build();

        expect(builder.definitions).to.deep.equal({
          Model: {
            properties: {
              prop: {
                type: "string"
              }
            },
            type: "object"
          }
        });

        expect(builder.parameters).to.deep.equal([
          {
            description: "Description",
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/Model"
            }
          }
        ]);
      });
    });

    describe("when multiple expression", () => {
      before(() => {
        const storeGet = (key: string) => {
          if (key === "hidden") {
            return false;
          }

          return {test: "test"};
        };

        this.params = [
          {
            paramType: ParamTypes.BODY,
            expression: "test",
            required: true,
            type: String,
            typeName: "Test",
            store: {
              get: storeGet
            }
          },
          {
            paramType: ParamTypes.BODY,
            expression: "test2",
            required: false,
            type: Number,
            typeName: "Test",
            store: {
              get: storeGet
            }
          }
        ];

        this.getParamsStub = Sinon.stub(ParamMetadata, "getParams").returns(this.params);

        this.builder = new OpenApiParamsBuilder(Ctrl, "test");

        this.result = this.builder.getInBodyParam();
      });
      after(() => {
        this.getParamsStub.restore();
      });

      it("should return data", () => {
        expect(this.result).to.deep.equal({
          description: "",
          in: "body",
          name: "body",
          required: true,
          schema: {
            $ref: "#/definitions/CtrlTestPayload"
          }
        });
      });

      it("should produce definition", () => {
        expect(this.builder._definitions).to.deep.equal({
          CtrlTestPayload: {
            properties: {
              test: {
                test: "test",
                type: "string"
              },
              test2: {
                test: "test",
                type: "number"
              }
            },
            required: ["test"],
            type: "object"
          }
        });
      });
    });
  });

  describe("createPropertiesFromExpression()", () => {
    describe("when the expression is given 't1.t2.t3'", () => {
      before(() => {
        this.getParamsStub = Sinon.stub(ParamMetadata, "getParams").returns([param0]);

        this.builder = new OpenApiParamsBuilder(Ctrl, "test");

        this.result = this.builder.createSchemaFromExpression({expression: "t1.t2.t3", required: true});
      });
      after(() => {
        this.getParamsStub.restore();
      });

      it("should create a schema", () => {
        expect(this.result).to.deep.eq({
          currentProperty: {},
          schema: {
            properties: {
              t1: {
                properties: {
                  t2: {
                    properties: {
                      t3: {}
                    },
                    required: ["t3"],
                    type: "object"
                  }
                },
                required: ["t2"],
                type: "object"
              }
            },
            required: ["t1"],
            type: "object"
          }
        });
      });
    });

    describe("when the expression is given 'event'", () => {
      before(() => {
        this.getParamsStub = Sinon.stub(ParamMetadata, "getParams").returns([param0]);
        this.builder = new OpenApiParamsBuilder(Ctrl, "test");

        this.result = this.builder.createSchemaFromExpression({expression: "event"});
      });
      after(() => {
        this.getParamsStub.restore();
      });

      it("should create a schema", () => {
        expect(this.result).to.deep.eq({
          currentProperty: {},
          schema: {
            properties: {
              event: {}
            },
            type: "object"
          }
        });
      });
    });

    describe("when the expression is not given", () => {
      before(() => {
        this.getParamsStub = Sinon.stub(ParamMetadata, "getParams").returns([param0]);

        this.builder = new OpenApiParamsBuilder(Ctrl, "test");

        this.result = this.builder.createSchemaFromExpression({expression: undefined});
      });
      after(() => {
        this.getParamsStub.restore();
      });

      it("should create a schema", () => {
        expect(this.result).to.deep.eq({
          currentProperty: {},
          schema: {}
        });
      });
    });
  });

  describe("createSchemaFromBodyParam()", () => {
    describe("when is a string", () => {
      before(() => {
        this.getParamsStub = Sinon.stub(ParamMetadata, "getParams").returns([param0]);

        this.builder = new OpenApiParamsBuilder(Ctrl, "test");

        this.result = this.builder.createSchemaFromBodyParam({
          expression: "t1.t2.t3",
          type: String,
          isClass: false,
          isCollection: false,
          store: {
            get: () => {}
          }
        });
      });
      after(() => {
        this.getParamsStub.restore();
      });

      it("should create a schema", () => {
        expect(this.result).to.deep.eq({
          properties: {
            t1: {
              properties: {
                t2: {
                  properties: {
                    t3: {
                      type: "string"
                    }
                  },
                  type: "object"
                }
              },
              type: "object"
            }
          },
          type: "object"
        });
      });
    });

    describe("when is a string[]", () => {
      const sandbox = Sinon.createSandbox();
      before(() => {
        sandbox.stub(ParamMetadata, "getParams");
      });
      after(() => {
        sandbox.restore();
      });

      it("should create a schema", () => {
        const param0 = new ParamMetadata({target: Ctrl, propertyKey: "test", index: 0});
        param0.paramType = ParamTypes.BODY;
        param0.type = String;
        param0.collectionType = Array;

        // @ts-ignore
        ParamMetadata.getParams.returns([param0]);

        const builder = new OpenApiParamsBuilder(Ctrl, "test");
        // @ts-ignore
        builder.build();

        expect(builder.parameters).to.deep.eq([
          {
            description: "",
            in: "body",
            name: "body",
            required: false,
            schema: {
              type: "array",
              items: {
                type: "string"
              }
            }
          }
        ]);
      });
    });

    describe("when is a Test", () => {
      class Test {}

      before(() => {
        this.getParamsStub = Sinon.stub(ParamMetadata, "getParams").returns([param0]);

        this.builder = new OpenApiParamsBuilder(Ctrl, "test");

        this.result = this.builder.createSchemaFromBodyParam({
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
      after(() => {
        this.getParamsStub.restore();
      });

      it("should create a schema", () => {
        expect(this.result).to.deep.eq({
          properties: {
            event: {
              $ref: "#/definitions/Test"
            }
          },
          type: "object"
        });
      });
    });
  });

  describe("createSchemaFromQueryParam", () => {
    describe("when there is a string", () => {
      before(() => {
        this.getParamsStub = Sinon.stub(ParamMetadata, "getParams").returns([param0]);

        this.builder = new OpenApiParamsBuilder(Ctrl, "test");

        this.result = this.builder.createSchemaFromQueryParam({
          expression: "t1",
          type: String,
          isClass: false,
          isCollection: false,
          isArray: false
        });
      });
      after(() => {
        this.getParamsStub.restore();
      });
      it("should return the right schema", () => {
        expect(this.result).to.deep.equal([
          {
            type: "string"
          }
        ]);
      });
    });

    describe("when there is an array of string", () => {
      before(() => {
        this.getParamsStub = Sinon.stub(ParamMetadata, "getParams").returns([param0]);

        this.builder = new OpenApiParamsBuilder(Ctrl, "test");

        this.result = this.builder.createSchemaFromQueryParam({
          expression: "t1",
          type: String,
          isClass: false,
          isCollection: true,
          isArray: true
        });
      });
      after(() => {
        this.getParamsStub.restore();
      });
      it("should return the right schema", () => {
        expect(this.result).to.deep.equal([
          {
            type: "array",
            collectionFormat: "multi",
            items: {
              type: "string"
            }
          }
        ]);
      });
    });

    describe("when there is an object of string", () => {
      before(() => {
        sandbox.stub(ParamMetadata, "getParams");
      });
      after(() => {
        sandbox.restore();
      });
      it("should return the right schema", () => {
        // @ts-ignore
        ParamMetadata.getParams.returns([param0]);

        const builder = new OpenApiParamsBuilder(Ctrl, "test");

        // @ts-ignore
        const result = builder.createSchemaFromQueryParam({
          expression: "t1",
          type: String,
          isClass: false,
          isCollection: true,
          isArray: false
        });

        expect(result).to.deep.equal([
          {
            type: "object",
            additionalProperties: {
              type: "string"
            }
          }
        ]);
      });
    });
  });

  describe("integration", () => {
    it("should create a schema", () => {
      class Ctrl {
        test(@BodyParams() test: SwaFoo2) {}
      }

      const builder = new OpenApiParamsBuilder(Ctrl, "test").build();

      expect(builder.parameters).to.deep.eq([
        {
          description: "",
          in: "body",
          name: "body",
          required: false,
          schema: {
            $ref: "#/definitions/SwaFoo2"
          }
        }
      ]);

      expect(builder.definitions).to.deep.eq({
        SwaAgeModel: {
          properties: {
            age: {
              description: "The age",
              title: "age",
              type: "number"
            },
            id: {
              description: "Unique identifier.",
              title: "id",
              type: "string"
            }
          },
          type: "object"
        },
        SwaFoo: {
          properties: {
            foo: {
              description: "Description.foo",
              title: "SwaFoo.foo",
              type: "object"
            },
            test: {
              description: "Description.test",
              title: "SwaFoo.test",
              type: "object"
            }
          },
          type: "object"
        },
        SwaFoo2: {
          description: "Description Class",
          properties: {
            Name: {
              type: "string"
            },
            ageModel: {
              $ref: "#/definitions/SwaAgeModel"
            },
            arrayOfString: {
              items: {
                type: "string"
              },
              type: "array"
            },
            dateStart: {
              type: "string"
            },
            foo: {
              $ref: "#/definitions/SwaFoo"
            },
            foos: {
              description: "SwaFoo2.foos description",
              example: "TODO",
              items: {
                $ref: "#/definitions/SwaFoo"
              },
              title: "SwaFoo2.foos",
              type: "array"
            },
            mapOfString: {
              type: "object",
              additionalProperties: {
                type: "string"
              }
            },
            mapAny: {
              type: "object",
              additionalProperties: {
                nullable: true,
                oneOf: [
                  {
                    type: "integer"
                  },
                  {
                    type: "number"
                  },
                  {
                    type: "string"
                  },
                  {
                    type: "boolean"
                  },
                  {
                    type: "array"
                  },
                  {
                    type: "object"
                  }
                ]
              }
            },
            anyValue: {
              nullable: true,
              oneOf: [
                {
                  type: "integer"
                },
                {
                  type: "number"
                },
                {
                  type: "string"
                },
                {
                  type: "boolean"
                },
                {
                  type: "array"
                },
                {
                  type: "object"
                }
              ]
            },
            nameModel: {
              $ref: "#/definitions/SwaNameModel"
            },
            test: {
              description: "Description test",
              title: "Test",
              type: "string"
            },
            theMap: {
              type: "object",
              additionalProperties: {
                $ref: "#/definitions/SwaFoo"
              },
              description: "SwaFoo2.theMap description",
              title: "SwaFoo2.theMap"
            },
            theSet: {
              type: "object",
              additionalProperties: {
                $ref: "#/definitions/SwaFoo"
              },
              description: "SwaFoo2.theSet description",
              title: "SwaFoo2.theSet"
            },
            uint: {
              type: "number"
            }
          },
          required: ["test"],
          title: "SwaFoo2",
          type: "object"
        },
        SwaNameModel: {
          properties: {
            id: {
              description: "Unique identifier.",
              title: "id",
              type: "string"
            },
            name: {
              description: "The name",
              title: "name",
              type: "string"
            }
          },
          type: "object"
        }
      });
    });
    it("should create query params", () => {
      class ParameterModel {
        @Property()
        @Required()
        name: string;

        @Property()
        @MinLength(1)
        start: string;
      }

      class Ctrl {
        test(@QueryParams() test: ParameterModel, @QueryParams("id") id: string) {}
      }

      const builder = new OpenApiParamsBuilder(Ctrl, "test").build();

      expect(builder.parameters).to.deep.eq([
        {
          in: "query",
          name: "name",
          required: true,
          type: "string"
        },
        {
          in: "query",
          minLength: 1,
          name: "start",
          required: false,
          type: "string"
        },
        {
          in: "query",
          name: "id",
          required: false,
          type: "string"
        }
      ]);
    });
  });
});
