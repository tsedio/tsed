import {AdditionalProperties, CollectionOf, getJsonSchema, Property, string} from "../../index.js";

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

  it("should declare additional properties with String Model", () => {
    @AdditionalProperties(string())
    class Model {
      @Property()
      id: string;

      [key: string]: any;
    }

    expect(getJsonSchema(Model)).toEqual({
      additionalProperties: {
        type: "string"
      },
      properties: {
        id: {
          type: "string"
        }
      },
      type: "object"
    });
  });

  it("should declare additional properties with String Type", () => {
    @AdditionalProperties(String)
    class Model {
      @Property()
      id: string;

      [key: string]: any;
    }

    expect(getJsonSchema(Model)).toEqual({
      additionalProperties: {
        type: "string"
      },
      properties: {
        id: {
          type: "string"
        }
      },
      type: "object"
    });
  });

  it("should declare additional properties with Number Type", () => {
    @AdditionalProperties(Number)
    class Model {
      @Property()
      id: string;

      [key: string]: any;
    }

    expect(getJsonSchema(Model)).toEqual({
      additionalProperties: {
        type: "number"
      },
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
