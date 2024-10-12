import "../../src/index.js";

import {BadRequest} from "@tsed/exceptions";
import {PlatformTest} from "@tsed/platform-http/testing";
import {BodyParams, ParamTypes, ParamValidationError, QueryParams, UseParam, ValidationPipe} from "@tsed/platform-params";
import {getJsonSchema, JsonParameterStore, MinLength, Post, Property, Required, Schema} from "@tsed/schema";

async function validate(value: any, metadata: any) {
  const pipe: ValidationPipe = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);

  try {
    return await pipe.transform(value, metadata);
  } catch (er) {
    if (er instanceof BadRequest) {
      return ParamValidationError.from(metadata, er);
    }

    throw er;
  }
}

describe("AjvValidationPipe", () => {
  beforeEach(() =>
    PlatformTest.create({
      ajv: {
        verbose: true
      }
    })
  );
  afterEach(() => PlatformTest.reset());

  describe("With raw json schema", () => {
    it("should validate object", async () => {
      class Ctrl {
        get(@BodyParams() @Schema({type: "object"}) value: any) {}
      }

      const value = {};
      const result = await validate(value, JsonParameterStore.get(Ctrl, "get", 0));

      expect(result).toEqual(value);
    });

    it("should throw an error", async () => {
      class Ctrl {
        get(@BodyParams() @Schema({type: "object"}) value: any) {}
      }

      const metadata = JsonParameterStore.get(Ctrl, "get", 0);
      const value: any[] = [];
      const error = await validate(value, metadata);

      expect(getJsonSchema(metadata)).toEqual({
        type: "object"
      });

      expect(error?.message).toEqual('Bad request on parameter "request.body".\nValue must be object. Given value: []');
      expect(error?.origin?.errors).toEqual([
        {
          data: [],
          requestPath: "body",
          dataPath: "",
          instancePath: "",
          keyword: "type",
          message: "must be object",
          params: {
            type: "object"
          },
          parentSchema: {
            type: "object"
          },
          schema: "object",
          schemaPath: "#/type"
        }
      ]);
    });
  });
  describe("With String", () => {
    it("should validate value", async () => {
      class Ctrl {
        get(@BodyParams() value: string) {}
      }

      const metadata = JsonParameterStore.get(Ctrl, "get", 0);
      expect(await validate("test", metadata)).toEqual("test");
    });
    it("should validate value (array)", async () => {
      class Ctrl {
        get(@BodyParams({useType: String}) value: string[]) {}
      }

      const metadata = JsonParameterStore.get(Ctrl, "get", 0);

      expect(getJsonSchema(metadata, {useAlias: true})).toEqual({
        type: "array",
        items: {
          type: "string"
        }
      });

      expect(await validate(["test"], metadata)).toEqual(["test"]);
    });
  });
  describe("With QueryParam with boolean", () => {
    it("should validate value", async () => {
      class Ctrl {
        get(@QueryParams("test") value: boolean) {}
      }

      const metadata = JsonParameterStore.get(Ctrl, "get", 0);

      expect(await validate("true", metadata)).toEqual(true);
      expect(await validate("false", metadata)).toEqual(false);
      expect(await validate("null", metadata)).toEqual(null);
      expect(await validate(undefined, metadata)).toBeUndefined();
    });
  });
  describe("With model", () => {
    it("should validate object", async () => {
      class Model {
        @Property()
        @Required()
        id: string;
      }

      class Ctrl {
        get(@UseParam({paramType: ParamTypes.BODY}) value: Model) {}
      }

      const value = {
        id: "hello"
      };
      const result = await validate(value, JsonParameterStore.get(Ctrl, "get", 0));

      expect(result).toEqual(value);
    });
    it("should throw an error", async () => {
      class Model {
        @Required()
        id: string;
      }

      class Ctrl {
        @Post("/")
        get(@UseParam({paramType: ParamTypes.BODY}) value: Model) {}
      }

      const value: any = {};
      const metadata = JsonParameterStore.get(Ctrl, "get", 0);

      const error = await validate(value, metadata);

      expect(getJsonSchema(metadata)).toEqual({
        type: "object",
        properties: {
          id: {
            minLength: 1,
            type: "string"
          }
        },
        required: ["id"]
      });

      expect(error?.message).toEqual("Bad request on parameter \"request.body\".\nModel must have required property 'id'. Given value: {}");
      expect(error?.origin.errors).toEqual([
        {
          data: {},
          dataPath: ".id",
          requestPath: "body",
          instancePath: "",
          keyword: "required",
          message: "must have required property 'id'",
          modelName: "Model",
          params: {
            missingProperty: "id"
          },
          parentSchema: {
            properties: {
              id: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["id"],
            type: "object"
          },
          schema: ["id"],
          schemaPath: "#/required"
        }
      ]);
    });
    it("should throw an error (deep property)", async () => {
      class UserModel {
        @Required()
        id: string;
      }

      class Model {
        @Required()
        id: string;

        @Required()
        user: UserModel;
      }

      class Ctrl {
        get(@UseParam({paramType: ParamTypes.BODY}) value: Model) {}
      }

      const value: any = {
        id: "id",
        user: {}
      };

      const error = await validate(value, JsonParameterStore.get(Ctrl, "get", 0));

      expect(error?.message).toEqual(
        "Bad request on parameter \"request.body\".\nModel.user must have required property 'id'. Given value: {}"
      );
    });
    it("should throw an error and hide password value", async () => {
      class Model {
        @Required()
        id: string;

        @Required()
        @MinLength(8)
        password: string;
      }

      class Ctrl {
        @Post("/")
        get(@UseParam({paramType: ParamTypes.BODY}) value: Model) {}
      }

      const value: any = {
        id: "id",
        password: "secret"
      };
      const metadata = JsonParameterStore.get(Ctrl, "get", 0);

      const error = await validate(value, metadata);

      expect(getJsonSchema(metadata)).toEqual({
        properties: {
          id: {
            minLength: 1,
            type: "string"
          },
          password: {
            minLength: 8,
            type: "string"
          }
        },
        required: ["id", "password"],
        type: "object"
      });

      expect(error?.origin.errors).toEqual([
        {
          requestPath: "body",
          data: "[REDACTED]",
          dataPath: ".password",
          instancePath: "/password",
          keyword: "minLength",
          message: "must NOT have fewer than 8 characters",
          modelName: "Model",
          params: {
            limit: 8
          },
          parentSchema: {
            minLength: 8,
            type: "string"
          },
          schema: 8,
          schemaPath: "#/properties/password/minLength"
        }
      ]);
    });
  });
  describe("With array of model", () => {
    it("should validate object", async () => {
      class Model {
        @Property()
        @Required()
        id: string;
      }

      class Ctrl {
        get(@UseParam({paramType: ParamTypes.BODY, useType: Model}) value: Model[]) {}
      }

      const value = [
        {
          id: "hello"
        }
      ];
      const result = await validate(value, JsonParameterStore.get(Ctrl, "get", 0));

      expect(result).toEqual(value);
    });
    it("should throw an error", async () => {
      class Model {
        @Property()
        @Required()
        id: string;
      }

      class Ctrl {
        get(@UseParam({paramType: ParamTypes.BODY, useType: Model}) value: Model[]) {}
      }

      const metadata = JsonParameterStore.get(Ctrl, "get", 0);
      const value: any = [{}];
      const error = await validate(value, metadata);

      expect(getJsonSchema(metadata)).toEqual({
        definitions: {
          Model: {
            properties: {
              id: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["id"],
            type: "object"
          }
        },
        items: {
          $ref: "#/definitions/Model"
        },
        type: "array"
      });
      expect(error?.message).toEqual(
        "Bad request on parameter \"request.body\".\nModel[0] must have required property 'id'. Given value: {}"
      );
    });
    it("should throw an error (deep property)", async () => {
      class UserModel {
        @Required()
        id: string;
      }

      class Model {
        @Required()
        id: string;

        @Required()
        user: UserModel;
      }

      class Ctrl {
        @Post("/")
        get(@BodyParams(Model) value: Model[]) {}
      }

      const metadata = JsonParameterStore.get(Ctrl, "get", 0);
      const value: any = [
        {
          id: "id",
          user: {}
        }
      ];

      expect(getJsonSchema(metadata)).toEqual({
        definitions: {
          Model: {
            properties: {
              id: {
                minLength: 1,
                type: "string"
              },
              user: {
                $ref: "#/definitions/UserModel"
              }
            },
            required: ["id", "user"],
            type: "object"
          },
          UserModel: {
            properties: {
              id: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["id"],
            type: "object"
          }
        },
        items: {
          $ref: "#/definitions/Model"
        },
        type: "array"
      });

      const error = await validate(value, metadata);

      expect(error?.message).toEqual(
        "Bad request on parameter \"request.body\".\nModel[0].user must have required property 'id'. Given value: {}"
      );
    });
  });
  describe("With Map of model", () => {
    it("should validate object", async () => {
      class Model {
        @Property()
        @Required()
        id: string;
      }

      class Ctrl {
        get(@UseParam({paramType: ParamTypes.BODY, useType: Model}) value: Map<string, Model>) {}
      }

      const value = {
        key1: {
          id: "hello"
        }
      };
      const result = await validate(value, JsonParameterStore.get(Ctrl, "get", 0));

      expect(result).toEqual(value);
    });
    it("should throw an error", async () => {
      class Model {
        @Property()
        @Required()
        id: string;
      }

      class Ctrl {
        get(@UseParam({paramType: ParamTypes.BODY, useType: Model}) value: Map<string, Model>) {}
      }

      const value: any = {key1: {}};

      const error = await validate(value, JsonParameterStore.get(Ctrl, "get", 0));

      expect(error?.message).toEqual(
        "Bad request on parameter \"request.body\".\nMap<key1, Model> must have required property 'id'. Given value: {}"
      );
    });
    it("should throw an error (deep property)", async () => {
      class UserModel {
        @Required()
        id: string;
      }

      class Model {
        @Required()
        id: string;

        @Required()
        user: UserModel;
      }

      class Ctrl {
        get(@UseParam({paramType: ParamTypes.BODY, useType: Model}) value: Map<string, Model>) {}
      }

      const value: any = {
        key1: {
          id: "id",
          user: {}
        }
      };

      const metadata = JsonParameterStore.get(Ctrl, "get", 0);
      const error = await validate(value, metadata);

      expect(getJsonSchema(metadata)).toEqual({
        additionalProperties: {
          $ref: "#/definitions/Model"
        },
        definitions: {
          Model: {
            properties: {
              id: {
                minLength: 1,
                type: "string"
              },
              user: {
                $ref: "#/definitions/UserModel"
              }
            },
            required: ["id", "user"],
            type: "object"
          },
          UserModel: {
            properties: {
              id: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["id"],
            type: "object"
          }
        },
        type: "object"
      });

      expect(error?.message).toEqual(
        "Bad request on parameter \"request.body\".\nMap<key1, Model>.user must have required property 'id'. Given value: {}"
      );
    });
  });
  describe("With Set of model", () => {
    it("should validate object", async () => {
      class Model {
        @Property()
        @Required()
        id: string;
      }

      class Ctrl {
        get(@UseParam({paramType: ParamTypes.BODY, useType: Model}) value: Set<Model>) {}
      }

      const value = [
        {
          id: "hello"
        }
      ];

      const result = await validate(value, JsonParameterStore.get(Ctrl, "get", 0));

      expect(result).toEqual(value);
    });
    it("should throw an error", async () => {
      class Model {
        @Property()
        @Required()
        id: string;
      }

      class Ctrl {
        get(@UseParam({paramType: ParamTypes.BODY, useType: Model}) value: Set<Model>) {}
      }

      const metadata = JsonParameterStore.get(Ctrl, "get", 0);
      const value: any = [{}];
      const error = await validate(value, metadata);

      expect(getJsonSchema(metadata)).toEqual({
        definitions: {
          Model: {
            properties: {
              id: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["id"],
            type: "object"
          }
        },
        items: {
          $ref: "#/definitions/Model"
        },
        type: "array",
        uniqueItems: true
      });

      expect(error?.message).toEqual(
        "Bad request on parameter \"request.body\".\nSet<0, Model> must have required property 'id'. Given value: {}"
      );
    });
    it("should throw an error (deep property)", async () => {
      class UserModel {
        @Required()
        id: string;
      }

      class Model {
        @Required()
        id: string;

        @Required()
        user: UserModel;
      }

      class Ctrl {
        get(@UseParam({paramType: ParamTypes.BODY, useType: Model}) value: Set<Model>) {}
      }

      const value: any = [
        {
          id: "id",
          user: {}
        }
      ];

      const metadata = JsonParameterStore.get(Ctrl, "get", 0);
      const error = await validate(value, metadata);

      expect(error?.message).toEqual(
        "Bad request on parameter \"request.body\".\nSet<0, Model>.user must have required property 'id'. Given value: {}"
      );
    });
  });
});
