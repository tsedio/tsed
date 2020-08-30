import {CollectionOf, Description, JsonSchemesRegistry, Name, Property, Required} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {ChildModelB, SwaFoo2, SwaNoDecoModel} from "../../test/helpers/class/classes";
import {OpenApiModelSchemaBuilder} from "./OpenApiModelSchemaBuilder";

describe("OpenApiModelSchemaBuilder", () => {
  describe("integration", () => {
    before(() => {});

    it("should not fail", () => {
      const builder = new OpenApiModelSchemaBuilder(SwaNoDecoModel);

      const build = () => {
        builder.build();
      };

      expect(build).to.not.throw();
    });

    it("should create a schema", () => {
      const schemaBuilder = new OpenApiModelSchemaBuilder(SwaFoo2).build();

      expect(schemaBuilder.schema).to.deep.eq({
        title: "SwaFoo2",
        description: "Description Class",
        type: "object",
        required: ["test"],
        properties: {
          Name: {
            type: "string",
          },
          ageModel: {
            $ref: "#/definitions/SwaAgeModel",
          },
          nameModel: {
            $ref: "#/definitions/SwaNameModel",
          },
          foo: {
            $ref: "#/definitions/SwaFoo",
          },
          dateStart: {
            type: "string",
          },
          foos: {
            description: "SwaFoo2.foos description",
            examples: ["TODO"],
            items: {
              $ref: "#/definitions/SwaFoo",
            },
            title: "SwaFoo2.foos",
            type: "array",
          },
          arrayOfString: {
            type: "array",
            items: {
              type: "string",
            },
          },
          test: {
            description: "Description test",
            title: "Test",
            type: "string",
          },
          theMap: {
            type: "object",
            additionalProperties: {
              $ref: "#/definitions/SwaFoo",
            },
            description: "SwaFoo2.theMap description",
            title: "SwaFoo2.theMap",
          },
          theSet: {
            type: "object",
            additionalProperties: {
              $ref: "#/definitions/SwaFoo",
            },
            description: "SwaFoo2.theSet description",
            title: "SwaFoo2.theSet",
          },
          mapOfString: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          mapAny: {
            type: "object",
            additionalProperties: {
              nullable: true,
              oneOf: [
                {
                  type: "integer",
                },
                {
                  type: "number",
                },
                {
                  type: "string",
                },
                {
                  type: "boolean",
                },
                {
                  type: "array",
                },
                {
                  type: "object",
                },
              ],
            },
          },
          anyValue: {
            nullable: true,
            oneOf: [
              {
                type: "integer",
              },
              {
                type: "number",
              },
              {
                type: "string",
              },
              {
                type: "boolean",
              },
              {
                type: "array",
              },
              {
                type: "object",
              },
            ],
          },
          uint: {
            type: "number",
          },
        },
      });
      expect(schemaBuilder.definitions).to.deep.eq({
        SwaFoo: {
          properties: {
            foo: {
              description: "Description.foo",
              title: "SwaFoo.foo",
              type: "object",
            },
            test: {
              description: "Description.test",
              title: "SwaFoo.test",
              type: "object",
            },
          },
          type: "object",
        },
        SwaFoo2: {
          description: "Description Class",
          required: ["test"],
          properties: {
            Name: {
              type: "string",
            },
            ageModel: {
              $ref: "#/definitions/SwaAgeModel",
            },
            nameModel: {
              $ref: "#/definitions/SwaNameModel",
            },
            foo: {
              $ref: "#/definitions/SwaFoo",
            },
            dateStart: {
              type: "string",
            },
            foos: {
              description: "SwaFoo2.foos description",
              examples: ["TODO"],
              items: {
                $ref: "#/definitions/SwaFoo",
              },
              title: "SwaFoo2.foos",
              type: "array",
            },
            arrayOfString: {
              type: "array",
              items: {
                type: "string",
              },
            },
            test: {
              description: "Description test",
              title: "Test",
              type: "string",
            },
            theMap: {
              type: "object",
              additionalProperties: {
                $ref: "#/definitions/SwaFoo",
              },
              description: "SwaFoo2.theMap description",
              title: "SwaFoo2.theMap",
            },
            theSet: {
              type: "object",
              additionalProperties: {
                $ref: "#/definitions/SwaFoo",
              },
              description: "SwaFoo2.theSet description",
              title: "SwaFoo2.theSet",
            },

            mapAny: {
              type: "object",
              additionalProperties: {
                nullable: true,
                oneOf: [
                  {
                    type: "integer",
                  },
                  {
                    type: "number",
                  },
                  {
                    type: "string",
                  },
                  {
                    type: "boolean",
                  },
                  {
                    type: "array",
                  },
                  {
                    type: "object",
                  },
                ],
              },
            },
            anyValue: {
              nullable: true,
              oneOf: [
                {
                  type: "integer",
                },
                {
                  type: "number",
                },
                {
                  type: "string",
                },
                {
                  type: "boolean",
                },
                {
                  type: "array",
                },
                {
                  type: "object",
                },
              ],
            },
            mapOfString: {
              type: "object",
              additionalProperties: {
                type: "string",
              },
            },
            uint: {
              type: "number",
            },
          },
          title: "SwaFoo2",
          type: "object",
        },
        SwaAgeModel: {
          properties: {
            age: {
              description: "The age",
              title: "age",
              type: "number",
            },
            id: {
              description: "Unique identifier.",
              title: "id",
              type: "string",
            },
          },
          type: "object",
        },
        SwaNameModel: {
          properties: {
            name: {
              description: "The name",
              title: "name",
              type: "string",
            },
            id: {
              description: "Unique identifier.",
              title: "id",
              type: "string",
            },
          },
          type: "object",
        },
      });
    });
  });
  describe("inheritance integration", () => {
    it("should create a schema", () => {
      const schemaBuilder = new OpenApiModelSchemaBuilder(ChildModelB).build();

      expect(schemaBuilder.schema).to.deep.eq({
        properties: {
          childPropertyB: {
            type: "string",
          },
          parentProperty: {
            type: "string",
          },
        },
        required: ["parentProperty", "childPropertyB"],
        type: "object",
      });
    });
  });
  describe("build()", () => {
    describe("when is as a description and required field", () => {
      it("should return a schema", () => {
        @Description("description")
        class Model {
          @Name("name")
          nameTest: string;

          @Property()
          @Required()
          test2: string;
        }

        const schemaBuilder = new OpenApiModelSchemaBuilder(Model).build();

        expect(schemaBuilder.schema).to.deep.equal({
          description: "description",
          properties: {
            name: {
              type: "string",
            },
            test2: {
              type: "string",
            },
          },
          required: ["test2"],
          type: "object",
        });
      });
    });
    describe("when the model is a primitive", () => {
      before(() => {});

      it("should return the schema", () => {
        class Model {
          @Property()
          test: string;
        }

        const builder = new OpenApiModelSchemaBuilder(Model).build();

        expect(builder.schema).to.deep.equal({
          properties: {
            test: {
              type: "string",
            },
          },
          type: "object",
        });

        expect(builder.definitions).to.deep.equal({
          Model: {
            properties: {
              test: {
                type: "string",
              },
            },
            type: "object",
          },
        });
      });
    });
    describe("when the model is a class", () => {
      it("should return the schema", () => {
        class Model {
          @Property()
          test: Object;
        }

        const builder = new OpenApiModelSchemaBuilder(Model).build();

        expect(builder.schema).to.deep.equal({
          properties: {
            test: {
              type: "object",
            },
          },
          type: "object",
        });

        expect(builder.definitions).to.deep.equal({
          Model: {
            properties: {
              test: {
                type: "object",
              },
            },
            type: "object",
          },
        });
      });
    });
    describe("when the model is a collection (string[])", () => {
      it("should return the schema", () => {
        class Model {
          @CollectionOf(String)
          test: string[];
        }

        const builder = new OpenApiModelSchemaBuilder(Model);

        // @ts-ignore
        builder.build();

        expect(builder.definitions).to.deep.equal({
          Model: {
            properties: {
              test: {
                items: {
                  type: "string",
                },
                type: "array",
              },
            },
            type: "object",
          },
        });
        expect(builder.schema).to.deep.equal({
          properties: {
            test: {
              items: {
                type: "string",
              },
              type: "array",
            },
          },
          type: "object",
        });
      });
    });
    describe("when the model is a collection (Class[])", () => {
      it("should return the schema", () => {
        class Items {
          @Property()
          value: string;
        }

        class Model {
          @CollectionOf(Items)
          test: Items[];
        }

        const builder = new OpenApiModelSchemaBuilder(Model).build();

        expect(builder.schema).to.deep.equal({
          properties: {
            test: {
              items: {
                $ref: "#/definitions/Items",
              },
              type: "array",
            },
          },
          type: "object",
        });

        expect(builder.definitions).to.deep.equal({
          Items: {
            properties: {
              value: {
                type: "string",
              },
            },
            type: "object",
          },
          Model: {
            properties: {
              test: {
                items: {
                  $ref: "#/definitions/Items",
                },
                type: "array",
              },
            },
            type: "object",
          },
        });
      });
    });
  });
  describe("getClassSchema()", () => {
    before(() => {
      Sinon.stub(JsonSchemesRegistry, "getSchemaDefinition").returns({type: "string"});
    });

    after(() => {
      // @ts-ignore
      JsonSchemesRegistry.getSchemaDefinition.restore();
    });

    it("should call getSchemaDefinition", () => {
      const schemaBuilder = new OpenApiModelSchemaBuilder(SwaFoo2);
      // @ts-ignore
      const result = schemaBuilder.getClassSchema();

      expect(result).to.deep.eq({type: "string"});
      // @ts-ignore
      expect(JsonSchemesRegistry.getSchemaDefinition).to.have.been.calledWithExactly(SwaFoo2);
    });
  });
});
