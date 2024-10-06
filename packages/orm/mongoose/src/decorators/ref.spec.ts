import {catchError, Store} from "@tsed/core";
import {getJsonSchema, Property} from "@tsed/schema";
import {Schema} from "mongoose";

import {MONGOOSE_MODEL_NAME, MONGOOSE_SCHEMA} from "../constants/constants.js";
import {MongooseModels} from "../registries/MongooseModels.js";
import {Ref} from "./ref.js";

describe("@Ref()", () => {
  describe("type is a class", () => {
    it("should set metadata and catch error", () => {
      const error = catchError(() => {
        class Model {
          @Ref(undefined)
          num: number[];
        }
      });

      expect(error?.message).toEqual(
        "A model is required on `@Ref(model)` decorator. Please give a model or wrap it inside an arrow function if you have a circular reference."
      );
    });

    it("should set metadata", () => {
      class RefTest {
        @Property()
        id: string;
      }

      Store.from(RefTest).set(MONGOOSE_MODEL_NAME, "RefTest");

      class Test {
        @Ref(RefTest)
        test: Ref<RefTest>;
      }

      const store = Store.from(Test, "test");
      const schema = getJsonSchema(Test);

      expect(schema).toEqual({
        definitions: {
          RefTest: {
            type: "object",
            properties: {
              id: {
                type: "string"
              }
            }
          }
        },
        properties: {
          test: {
            oneOf: [
              {
                description: "A reference ObjectID",
                examples: ["5ce7ad3028890bd71749d477"],
                type: "string"
              },
              {
                $ref: "#/definitions/RefTest"
              }
            ]
          }
        },
        type: "object"
      });

      expect(store.get(MONGOOSE_SCHEMA)).toEqual({
        type: Schema.Types.ObjectId,
        ref: RefTest
      });
    });
  });
  describe("type is a map of class", () => {
    it("should set metadata", () => {
      class RefTest {
        @Property()
        id: string;
      }

      Store.from(RefTest).set(MONGOOSE_MODEL_NAME, "RefTest");
      MongooseModels.set("RefTest", RefTest);

      class Test {
        @Ref(RefTest)
        test: Map<string, Ref<RefTest>>;
      }

      const store = Store.from(Test, "test");
      const schema = getJsonSchema(Test);

      expect(schema).toEqual({
        definitions: {
          RefTest: {
            properties: {
              id: {
                type: "string"
              }
            },
            type: "object"
          }
        },
        properties: {
          test: {
            additionalProperties: {
              oneOf: [
                {
                  description: "A reference ObjectID",
                  examples: ["5ce7ad3028890bd71749d477"],
                  type: "string"
                },
                {
                  $ref: "#/definitions/RefTest"
                }
              ]
            },
            type: "object"
          }
        },
        type: "object"
      });

      expect(store.get(MONGOOSE_SCHEMA)).toEqual({
        type: Schema.Types.ObjectId,
        ref: RefTest
      });
    });
  });
  describe("type is a Function", () => {
    it("should set metadata", () => {
      class RefTest {
        @Property()
        id: string;
      }

      Store.from(RefTest).set(MONGOOSE_MODEL_NAME, "RefTest");
      const arrow = () => RefTest;

      class Test {
        @Ref(arrow)
        test: Ref<RefTest>;
      }

      const store = Store.from(Test, "test");
      const schema = getJsonSchema(Test);

      expect(schema).toEqual({
        definitions: {
          RefTest: {
            type: "object",
            properties: {
              id: {
                type: "string"
              }
            }
          }
        },
        properties: {
          test: {
            oneOf: [
              {
                description: "A reference ObjectID",
                examples: ["5ce7ad3028890bd71749d477"],
                type: "string"
              },
              {
                $ref: "#/definitions/RefTest"
              }
            ]
          }
        },
        type: "object"
      });

      expect(store.get(MONGOOSE_SCHEMA)).toEqual({
        type: Schema.Types.ObjectId,
        ref: arrow
      });
    });
  });
  describe("type is a string (deprecated)", () => {
    it("should set metadata", () => {
      class RefTest {}

      class Test {
        @Ref("RefTest")
        test: Ref<RefTest>;
      }

      MongooseModels.set("RefTest", RefTest);
      const store = Store.from(Test, "test");

      expect(getJsonSchema(Test)).toEqual({
        definitions: {
          RefTest: {
            properties: {
              id: {
                type: "string"
              }
            },
            type: "object"
          }
        },
        properties: {
          test: {
            oneOf: [
              {
                description: "A reference ObjectID",
                examples: ["5ce7ad3028890bd71749d477"],
                type: "string"
              },
              {
                $ref: "#/definitions/RefTest"
              }
            ]
          }
        },
        type: "object"
      });
      expect(store.get(MONGOOSE_SCHEMA)).toEqual({
        type: Schema.Types.ObjectId,
        ref: "RefTest"
      });
    });
  });
  describe("JsonSchema gets generated based on populated groups", () => {
    class MyChildModel {
      @Property()
      test: string;
    }

    class MyParentModel {
      @Property()
      id: string;

      @Ref(MyChildModel, {populatedGroups: ["group1", "group2"]})
      child1: Ref<MyChildModel>;

      @Ref(MyChildModel, {populatedGroups: ["group2"]})
      child2: Ref<MyChildModel>;

      @Ref(MyChildModel)
      child3: Ref<MyChildModel>;
    }

    it("should reflect the populated groups options in the schema (with given groups)", () => {
      const spec = getJsonSchema(MyParentModel, {
        groups: ["group1", "group3"]
      });

      expect(spec).toEqual({
        definitions: {
          MyChildModel: {
            properties: {
              test: {
                type: "string"
              }
            },
            type: "object"
          },
          MyChildModelGroup1Group3: {
            properties: {
              test: {
                type: "string"
              }
            },
            type: "object"
          }
        },
        properties: {
          child1: {
            oneOf: [
              {
                $ref: "#/definitions/MyChildModelGroup1Group3"
              }
            ]
          },
          child2: {
            oneOf: [
              {
                description: "A reference ObjectID",
                examples: ["5ce7ad3028890bd71749d477"],
                type: "string"
              }
            ]
          },
          child3: {
            oneOf: [
              {
                description: "A reference ObjectID",
                examples: ["5ce7ad3028890bd71749d477"],
                type: "string"
              },
              {
                $ref: "#/definitions/MyChildModel"
              }
            ]
          },
          id: {
            type: "string"
          }
        },
        type: "object"
      });
    });

    it("should reflect the populated groups options in the schema (without given groups)", () => {
      const spec = getJsonSchema(MyParentModel, {
        groups: []
      });
      expect(spec).toEqual({
        definitions: {
          MyChildModel: {
            properties: {
              test: {
                type: "string"
              }
            },
            type: "object"
          }
        },
        properties: {
          child1: {
            oneOf: [
              {
                description: "A reference ObjectID",
                examples: ["5ce7ad3028890bd71749d477"],
                type: "string"
              }
            ]
          },
          child2: {
            oneOf: [
              {
                description: "A reference ObjectID",
                examples: ["5ce7ad3028890bd71749d477"],
                type: "string"
              }
            ]
          },
          child3: {
            oneOf: [
              {
                description: "A reference ObjectID",
                examples: ["5ce7ad3028890bd71749d477"],
                type: "string"
              },
              {
                $ref: "#/definitions/MyChildModel"
              }
            ]
          },
          id: {
            type: "string"
          }
        },
        type: "object"
      });
    });
  });
});
