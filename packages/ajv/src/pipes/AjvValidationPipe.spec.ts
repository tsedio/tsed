import {UseSchema} from "@tsed/ajv";
import {
  BodyParams,
  ParamMetadata,
  ParamTypes,
  ParamValidationError,
  PlatformTest,
  Property,
  QueryParams,
  Required,
  UseParam,
  ValidationError
} from "@tsed/common";
import {expect} from "chai";
import {AjvValidationPipe} from "./AjvValidationPipe";

async function validate(value: any, metadata: any) {
  const pipe: AjvValidationPipe = await PlatformTest.invoke<AjvValidationPipe>(AjvValidationPipe);

  try {
    return pipe.transform(value, metadata);
  } catch (er) {
    if (er instanceof ValidationError) {
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
        get(@BodyParams() @UseSchema({type: "object"}) value: any) {
        }
      }

      const value = {};
      const result = await validate(value, ParamMetadata.get(Ctrl, "get", 0));

      expect(result).to.deep.equal(value);
    });
    it("should throw an error", async () => {
      class Ctrl {
        get(@BodyParams() @UseSchema({type: "object"}) value: any) {
        }
      }

      const value: any[] = [];

      const error = await validate(value, ParamMetadata.get(Ctrl, "get", 0));

      expect(error?.message).to.deep.equal("Bad request on parameter \"request.body\".\nValue should be object. Given value: []");
      expect(error?.origin?.errors).to.deep.equal([
        {
          data: [],
          dataPath: "",
          keyword: "type",
          message: "should be object",
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
        get(@BodyParams() value: string) {
        }
      }

      const metadata = ParamMetadata.get(Ctrl, "get", 0);
      expect(await validate("test", metadata)).to.deep.equal("test");
    });
    it("should validate value (array)", async () => {
      class Ctrl {
        get(@BodyParams({useType: String}) value: string[]) {
        }
      }

      const metadata = ParamMetadata.get(Ctrl, "get", 0);
      expect(await validate(["test"], metadata)).to.deep.equal(["test"]);
    });
  });
  describe("With QueryParam with boolean", () => {
    it("should validate value", async () => {
      class Ctrl {
        get(@QueryParams("test") value: boolean) {
        }
      }

      const metadata = ParamMetadata.get(Ctrl, "get", 0);

      expect(await validate("true", metadata)).to.deep.equal("true");
      expect(await validate("null", metadata)).to.deep.equal("null");
      expect(await validate(undefined, metadata)).to.deep.equal(undefined);
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
        get(@UseParam(ParamTypes.BODY) value: Model) {
        }
      }

      const value = {
        id: "hello"
      };
      const result = await validate(value, ParamMetadata.get(Ctrl, "get", 0));

      expect(result).to.deep.equal(value);
    });
    it("should throw an error", async () => {
      class Model {
        @Property()
        @Required()
        id: string;
      }

      class Ctrl {
        get(@UseParam(ParamTypes.BODY) value: Model) {
        }
      }

      const value: any = {};

      const error = await validate(value, ParamMetadata.get(Ctrl, "get", 0));

      expect(error?.message).to.deep.equal(
        "Bad request on parameter \"request.body\".\nModel should have required property 'id'. Given value: {}"
      );
      expect(error?.origin.errors).to.deep.equal([
        {
          data: {},
          dataPath: "",
          keyword: "required",
          message: "should have required property 'id'",
          modelName: "Model",
          params: {
            missingProperty: "id"
          },
          parentSchema: {
            definitions: {},
            properties: {
              id: {
                type: "string"
              }
            },
            required: ["id"],
            type: "object"
          },
          schema: {
            id: {
              type: "string"
            }
          },
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
        get(@UseParam(ParamTypes.BODY) value: Model) {
        }
      }

      const value: any = {
        id: "id",
        user: {}
      };

      const error = await validate(value, ParamMetadata.get(Ctrl, "get", 0));

      expect(error?.message).to.deep.equal(
        "Bad request on parameter \"request.body\".\nModel.user should have required property 'id'. Given value: {}"
      );
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
        get(@UseParam(ParamTypes.BODY, {useType: Model}) value: Model[]) {
        }
      }

      const value = [
        {
          id: "hello"
        }
      ];
      const result = await validate(value, ParamMetadata.get(Ctrl, "get", 0));

      expect(result).to.deep.equal(value);
    });
    it("should throw an error", async () => {
      class Model {
        @Property()
        @Required()
        id: string;
      }

      class Ctrl {
        get(@UseParam(ParamTypes.BODY, {useType: Model}) value: Model[]) {
        }
      }

      const value: any = [{}];

      const error = await validate(value, ParamMetadata.get(Ctrl, "get", 0));

      expect(error?.message).to.deep.equal(
        "Bad request on parameter \"request.body\".\n[0]Model should have required property 'id'. Given value: {}"
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
        get(@UseParam(ParamTypes.BODY, {useType: Model}) value: Model[]) {
        }
      }

      const value: any = [
        {
          id: "id",
          user: {}
        }
      ];

      const error = await validate(value, ParamMetadata.get(Ctrl, "get", 0));

      expect(error?.message).to.deep.equal(
        "Bad request on parameter \"request.body\".\n[0]Model.user should have required property 'id'. Given value: {}"
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
        get(@UseParam(ParamTypes.BODY, {useType: Model}) value: Map<string, Model>) {
        }
      }

      const value = {
        key1: {
          id: "hello"
        }
      };
      const result = await validate(value, ParamMetadata.get(Ctrl, "get", 0));

      expect(result).to.deep.equal(value);
    });
    it("should throw an error", async () => {
      class Model {
        @Property()
        @Required()
        id: string;
      }

      class Ctrl {
        get(@UseParam(ParamTypes.BODY, {useType: Model}) value: Map<string, Model>) {
        }
      }

      const value: any = {key1: {}};

      const error = await validate(value, ParamMetadata.get(Ctrl, "get", 0));

      expect(error?.message).to.deep.equal(
        "Bad request on parameter \"request.body\".\nkey1.Model should have required property 'id'. Given value: {}"
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
        get(@UseParam(ParamTypes.BODY, {useType: Model}) value: Map<string, Model>) {
        }
      }

      const value: any = {
        key1: {
          id: "id",
          user: {}
        }
      };

      const error = await validate(value, ParamMetadata.get(Ctrl, "get", 0));

      expect(error?.message).to.deep.equal(
        "Bad request on parameter \"request.body\".\nkey1.Model.user should have required property 'id'. Given value: {}"
      );
    });
  });
});
