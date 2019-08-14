import {ParamMetadata, ParamRegistry, ParamTypes} from "@tsed/common";
import {Store} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {OpenApiParamsBuilder} from "../../src/class/OpenApiParamsBuilder";
import {Ctrl, SwaFoo2} from "./helpers/classes";

const param0 = new ParamMetadata({target: Ctrl, propertyKey: "test", index: 0});
param0.service = ParamTypes.BODY;
param0.paramType = ParamTypes.BODY;
param0.type = SwaFoo2;

describe("OpenApiParamsBuilder", () => {
  describe("build()", () => {
    describe("when consumes has application/x-www-form-urlencoded", () => {
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
            store: {
              get: storeGet
            }
          }
        ];

        class FakeMetadata {
          attr1: any;
          attr2: any;

          constructor(public target: any) {
          }

          test() {
            return this.target;
          }
        }

        this.store = new Store([FakeMetadata]);
        this.store._map = new Map();
        this.store._map.set("operation", {consumes: ["application/x-www-form-urlencoded"]});

        this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns(this.params);
        this.fromMethodStub = Sinon.stub(Store, "fromMethod").returns(this.store);

        this.builder = new OpenApiParamsBuilder(Ctrl, "test");
      });
      after(() => {
        this.getParamsStub.restore();
        this.fromMethodStub.restore();
      });
      it("should set hasFromData to true", () => {
        expect(this.builder.hasFormData).to.equal(true);
      });
    });

    describe("when consumes does not have application/x-www-form-urlencoded", () => {
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
            store: {
              get: storeGet
            }
          }
        ];

        class FakeMetadata {
          attr1: any;
          attr2: any;

          constructor(public target: any) {
          }

          test() {
            return this.target;
          }
        }

        this.store = new Store([FakeMetadata]);
        this.store._map = new Map();
        this.store._map.set("operation", {consumes: ["application/json"]});

        this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns(this.params);
        this.fromMethodStub = Sinon.stub(Store, "fromMethod").returns(this.store);

        this.builder = new OpenApiParamsBuilder(Ctrl, "test");
      });
      after(() => {
        this.getParamsStub.restore();
        this.fromMethodStub.restore();
      });
      it("should set hasFromData to false", () => {
        expect(this.builder.hasFormData).to.equal(false);
      });
    });

    describe("when formData", () => {
      before(() => {
        const storeGet = (key: string) => {
          if (key === "hidden") {
            return false;
          }

          return {test: "test"};
        };

        this.params = [
          {
            paramType: ParamTypes.FORM_DATA,
            expression: "expression1",
            required: true,
            store: {
              get: storeGet
            }
          },
          {
            paramType: ParamTypes.BODY,
            expression: "expression1",
            required: true,
            store: {
              get: storeGet
            }
          }
        ];

        this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns(this.params);

        this.builder = new OpenApiParamsBuilder(Ctrl, "test");

        Sinon.stub(this.builder, "getInHeaders").returns("getInHeaders");
        Sinon.stub(this.builder, "getInPathParams").returns("getInPathParams");
        Sinon.stub(this.builder, "getInQueryParams").returns("getInQueryParams");
        Sinon.stub(this.builder, "getInFormData").returns("getInFormData");
        Sinon.stub(this.builder, "getInBodyParam").returns("getInBodyParam");

        this.result = this.builder.build();
      });

      after(() => {
        this.getParamsStub.restore();
      });

      it("should call getInHeaders()", () => this.builder.getInHeaders.should.have.been.called);

      it("should call getInPathParams()", () => this.builder.getInPathParams.should.have.been.called);

      it("should call getInQueryParams()", () => this.builder.getInQueryParams.should.have.been.called);

      it("should call getInFormData()", () => this.builder.getInFormData.should.have.been.called);

      it("shouldn't call getInBodyParam()", () => this.builder.getInBodyParam.should.not.have.been.called);
      it("should concat results", () => {
        expect(this.builder._parameters).to.deep.equal(["getInHeaders", "getInPathParams", "getInQueryParams", "getInFormData"]);
      });
    });
    describe("when body", () => {
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
            store: {
              get: storeGet
            }
          },
          {
            paramType: ParamTypes.BODY,
            expression: "expression1",
            required: true,
            store: {
              get: storeGet
            }
          }
        ];

        this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns(this.params);

        this.builder = new OpenApiParamsBuilder(Ctrl, "test");

        Sinon.stub(this.builder, "getInHeaders").returns("getInHeaders");
        Sinon.stub(this.builder, "getInPathParams").returns("getInPathParams");
        Sinon.stub(this.builder, "getInQueryParams").returns("getInQueryParams");
        Sinon.stub(this.builder, "getInFormData").returns("getInFormData");
        Sinon.stub(this.builder, "getInBodyParam").returns("getInBodyParam");

        this.result = this.builder.build();
      });

      after(() => {
        this.getParamsStub.restore();
      });

      it("should call getInHeaders()", () => this.builder.getInHeaders.should.have.been.called);

      it("should call getInPathParams()", () => this.builder.getInPathParams.should.have.been.called);

      it("should call getInQueryParams()", () => this.builder.getInQueryParams.should.have.been.called);

      it("should call getInBodyParam()", () => this.builder.getInBodyParam.should.have.been.called);

      it("shouldn't call getInFormData()", () => this.builder.getInFormData.should.not.have.been.called);
      it("should concat results", () => {
        expect(this.builder._parameters).to.deep.equal(["getInHeaders", "getInPathParams", "getInQueryParams", "getInBodyParam"]);
      });
    });
  });

  describe("getInQueryParams()", () => {
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

      this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns(this.params);

      this.builder = new OpenApiParamsBuilder(Ctrl, "test");
      Sinon.stub(this.builder, "addResponse400");
      Sinon.stub(this.builder, "createSchemaFromQueryParam").returns({type: "string"});

      this.result = this.builder.getInQueryParams();
    });
    after(() => {
      this.getParamsStub.restore();
    });

    it("should call createSchemaFromQueryParam()", () => {
      this.builder.createSchemaFromQueryParam.should.have.been.calledTwice.and
        .calledWithExactly(this.params[0])
        .and.calledWithExactly(this.params[2]);
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

      this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns(this.params);

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

      this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns(this.params);

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
      class Test {
      }

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
            required: true,
            type: Test,
            typeName: "Test",
            store: {
              get: storeGet
            }
          }
        ];

        this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns(this.params);

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
            $ref: "#/definitions/Test"
          },
          test: "test"
        });
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

        this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns(this.params);

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
        this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns([param0]);

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
        this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns([param0]);
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
        this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns([param0]);

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
        this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns([param0]);

        this.builder = new OpenApiParamsBuilder(Ctrl, "test");

        this.result = this.builder.createSchemaFromBodyParam({
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
      before(() => {
        this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns([param0]);

        this.builder = new OpenApiParamsBuilder(Ctrl, "test");

        this.result = this.builder.createSchemaFromBodyParam({
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
      after(() => {
        this.getParamsStub.restore();
      });

      it("should create a schema", () => {
        expect(this.result).to.deep.eq({
          properties: {
            event: {
              type: "object",
              additionalProperties: {
                type: "string"
              }
            }
          },
          type: "object"
        });
      });
    });

    describe("when is a Test", () => {
      class Test {
      }

      before(() => {
        this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns([param0]);

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
        this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns([param0]);

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
        this.result.should.deep.equal({
          type: "string"
        });
      });
    });

    describe("when there is an array of string", () => {
      before(() => {
        this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns([param0]);

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
        this.result.should.deep.equal({
          type: "array",
          collectionFormat: "multi",
          items: {
            type: "string"
          }
        });
      });
    });

    describe("when there is an object of string", () => {
      before(() => {
        this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns([param0]);

        this.builder = new OpenApiParamsBuilder(Ctrl, "test");

        this.result = this.builder.createSchemaFromQueryParam({
          expression: "t1",
          type: String,
          isClass: false,
          isCollection: true,
          isArray: false
        });
      });
      after(() => {
        this.getParamsStub.restore();
      });
      it("should return the right schema", () => {
        this.result.should.deep.equal({
          type: "object",
          additionalProperties: {
            type: "string"
          }
        });
      });
    });
  });

  describe("integration", () => {
    before(() => {
      this.getParamsStub = Sinon.stub(ParamRegistry, "getParams").returns([param0]);

      this.builder = new OpenApiParamsBuilder(Ctrl, "test");
      this.builder.build();
    });
    after(() => {
      this.getParamsStub.restore();
    });

    it("should create a schema", () => {
      expect(this.builder.parameters).to.deep.eq([
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
    });

    it("should create a definitions", () => {
      expect(this.builder.definitions).to.deep.eq({
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
  });
});
