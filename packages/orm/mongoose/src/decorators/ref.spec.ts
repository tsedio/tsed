import {Store} from "@tsed/core";
import {getJsonSchema, Property} from "@tsed/schema";
import {expect} from "chai";
import {Schema} from "mongoose";
import {MONGOOSE_MODEL_NAME, MONGOOSE_SCHEMA} from "../../src/constants";
import {Ref} from "../../src/decorators";
import {MongooseModels} from "../registries/MongooseModels";

describe("@Ref()", () => {
  describe("type is a class", () => {
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

      expect(schema).to.deep.eq({
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
                description: "Mongoose Ref ObjectId",
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

      expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
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

      expect(schema).to.deep.eq({
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
                  description: "Mongoose Ref ObjectId",
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

      expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
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

      expect(schema).to.deep.eq({
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
                description: "Mongoose Ref ObjectId",
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

      expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
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

      expect(getJsonSchema(Test)).to.deep.eq({
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
                description: "Mongoose Ref ObjectId",
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
      expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
        type: Schema.Types.ObjectId,
        ref: "RefTest"
      });
    });
  });
});
