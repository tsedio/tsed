import {AdditionalProperties, CollectionOf, getJsonSchema, Property} from "@tsed/schema";

describe("AdditionalProperties", () => {
  it("should declare additional properties", () => {
    @AdditionalProperties(true)
    class Model {
      @Property()
      id: string;

      [key: string]: any;
    }

    expect(getJsonSchema(Model)).toEqual({
      additionalProperties: true,
      properties: {
        id: {
          type: "string"
        }
      },
      type: "object"
    });
  });
  it("should declare additional properties with model", () => {
    class SubModel {
      @Property()
      id: string;
    }
    @AdditionalProperties(SubModel)
    class Model {
      [key: string]: SubModel;
    }

    class Container {
      @CollectionOf(Model)
      list: Model[];
    }

    expect(getJsonSchema(Container)).toEqual({
      definitions: {
        Model: {
          additionalProperties: {
            $ref: "#/definitions/SubModel"
          },
          type: "object"
        },
        SubModel: {
          properties: {
            id: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        list: {
          items: {
            $ref: "#/definitions/Model"
          },
          type: "array"
        }
      },
      type: "object"
    });
  });
});
