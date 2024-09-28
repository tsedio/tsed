import {
  CollectionOf,
  Default,
  Enum,
  getJsonSchema,
  Maximum,
  MaxLength,
  Minimum,
  MinLength,
  Name,
  Pattern,
  Property,
  Required
} from "@tsed/schema";
import {Schema as SchemaMongoose, Types} from "mongoose";

import {DiscriminatorKey} from "../decorators/discriminatorKey.js";
import {Model} from "../decorators/model.js";
import {ObjectID} from "../decorators/objectID.js";
import {Ref} from "../decorators/ref.js";
import {Schema} from "../decorators/schema.js";
import {SchemaIgnore} from "../decorators/schemaIgnore.js";
import {VersionKey} from "../decorators/versionKey.js";
import {VirtualRef, VirtualRefs} from "../decorators/virtualRef.js";
import {getSchema} from "./createSchema.js";

describe("createSchema", () => {
  it("should create schema", () => {
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    // GIVEN
    @Model()
    class Test {
      @Name("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    // WHEN
    const result = getSchema(Test);

    // THEN
    expect(result.obj).toEqual({
      _id: {
        required: false,
        type: String
      },
      enum: {
        enum: ["v1", "v2"],
        required: false,
        type: String
      },
      name: {
        default: "defaultValue",
        match: /pattern/,
        maxlength: 100,
        minlength: 0,
        required: false,
        type: String
      },
      test: {
        max: 10,
        min: 0,
        required: false,
        type: Number
      }
    });
  });
  it("should create schema with buffer", () => {
    // GIVEN
    @Model()
    class Test {
      @Name("id")
      _id: string;

      @Property(Buffer)
      image: Buffer;
    }

    // WHEN
    const result = getSchema(Test);

    // THEN
    expect(result.obj).toEqual({
      _id: {
        required: false,
        type: String
      },
      image: {
        required: false,
        type: Buffer
      }
    });
  });
  it("should create schema with required property", () => {
    // GIVEN
    @Model()
    class Test2 {
      @Required()
      test: string;
    }

    // WHEN
    const result: any = getSchema(Test2);

    // THEN
    expect(result.obj.test.required).toBeInstanceOf(Function);
  });
  it("should create schema with subdocument", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Schema()
    class Children {
      @Name("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    @Model()
    class Test3 {
      @Property()
      test: Children;
    }

    // WHEN
    const testSchema = getSchema(Test3);
    const childrenSchema = getSchema(Children);

    // THEN
    expect(testSchema.obj).toEqual({
      test: {
        type: childrenSchema,
        required: false
      }
    });

    expect(childrenSchema.obj).toEqual({
      _id: {
        required: false,
        type: String
      },
      enum: {
        enum: ["v1", "v2"],
        required: false,
        type: String
      },
      name: {
        default: "defaultValue",
        match: /pattern/,
        maxlength: 100,
        minlength: 0,
        required: false,
        type: String
      },
      test: {
        max: 10,
        min: 0,
        required: false,
        type: Number
      }
    });
  });
  it("should create schema with ref", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Model()
    class Children {
      @ObjectID("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    @Model()
    class Test4 {
      @Ref(Children)
      test: Ref<Children>;
    }

    // WHEN
    const testSchema = getSchema(Test4);
    const childrenSchema = getSchema(Children);

    // THEN
    expect(testSchema.obj).toEqual({
      test: {
        type: SchemaMongoose.Types.ObjectId,
        ref: "Children",
        required: false
      }
    });

    expect(childrenSchema.obj).toEqual({
      _id: {
        auto: true,
        required: false,
        type: Types.ObjectId
      },
      enum: {
        enum: ["v1", "v2"],
        required: false,
        type: String
      },
      name: {
        default: "defaultValue",
        match: /pattern/,
        maxlength: 100,
        minlength: 0,
        required: false,
        type: String
      },
      test: {
        max: 10,
        min: 0,
        required: false,
        type: Number
      }
    });

    expect(getJsonSchema(Test4)).toEqual({
      definitions: {
        Children: {
          properties: {
            enum: {
              enum: ["v1", "v2"],
              type: "string"
            },
            id: {
              description: "An ObjectID",
              examples: ["5ce7ad3028890bd71749d477"],
              pattern: "^[0-9a-fA-F]{24}$",
              type: "string"
            },
            name: {
              default: "defaultValue",
              maxLength: 100,
              minLength: 0,
              pattern: "pattern",
              type: "string"
            },
            test: {
              maximum: 10,
              minimum: 0,
              type: "number"
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
              $ref: "#/definitions/Children"
            }
          ]
        }
      },
      type: "object"
    });
    expect(getJsonSchema(Children)).toEqual({
      properties: {
        enum: {
          enum: ["v1", "v2"],
          type: "string"
        },
        id: {
          description: "An ObjectID",
          examples: ["5ce7ad3028890bd71749d477"],
          pattern: "^[0-9a-fA-F]{24}$",
          type: "string"
        },
        name: {
          default: "defaultValue",
          maxLength: 100,
          minLength: 0,
          pattern: "pattern",
          type: "string"
        },
        test: {
          maximum: 10,
          minimum: 0,
          type: "number"
        }
      },
      type: "object"
    });
  });
  it("should create schema with virtual ref", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Model()
    class Children2 {
      @Name("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    @Model()
    class Test5 {
      @VirtualRef({ref: Children2, foreignField: "foo", justOne: true})
      test: VirtualRef<Children2>;
    }

    // WHEN
    const testSchema: any = getSchema(Test5);

    // THEN
    expect(testSchema.obj).toEqual({});
    expect(testSchema.virtuals.test.options).toMatchObject({
      foreignField: "foo",
      justOne: true,
      localField: "_id",
      options: undefined,
      ref: "Children2"
    });
  });
  it("should create schema with virtual ref (array)", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Model()
    class Children2 {
      @Name("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    @Model()
    class Test5 {
      @VirtualRef({ref: Children2, justOne: false, foreignField: "foo"})
      test: VirtualRefs<Children2>;
    }

    // WHEN
    const testSchema: any = getSchema(Test5);

    // THEN
    expect(testSchema.obj).toEqual({});
    expect(testSchema.virtuals.test.options).toMatchObject({
      foreignField: "foo",
      justOne: false,
      localField: "_id",
      options: undefined,
      ref: "Children2"
    });
  });
  it("should create schema with collection (Array of subdocument)", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Schema()
    class Children {
      @Name("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    @Model()
    class Test6 {
      @CollectionOf(Children)
      tests: Children[];
    }

    // WHEN
    const testSchema = getSchema(Test6);
    const childrenSchema = getSchema(Children);

    // THEN
    expect(testSchema.obj).toEqual({
      tests: [
        {
          type: childrenSchema,
          required: false
        }
      ]
    });

    expect(childrenSchema.obj).toEqual({
      _id: {
        required: false,
        type: String
      },
      enum: {
        enum: ["v1", "v2"],
        required: false,
        type: String
      },
      name: {
        default: "defaultValue",
        match: /pattern/,
        maxlength: 100,
        minlength: 0,
        required: false,
        type: String
      },
      test: {
        max: 10,
        min: 0,
        required: false,
        type: Number
      }
    });
  });
  it("should create schema with collection (Array of ref)", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Model()
    class Children3 {
      @Name("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    @Model()
    class Test7 {
      @Ref(Children3)
      tests: Ref<Children3>[];
    }

    // WHEN
    const testSchema = getSchema(Test7);

    // THEN
    expect(testSchema.obj).toEqual({
      tests: [
        {
          type: SchemaMongoose.Types.ObjectId,
          ref: "Children3",
          required: false
        }
      ]
    });
  });
  it("should create schema with collection (Array of virtual ref", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Model()
    class Children4 {
      @Name("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    @Model()
    class Test8 {
      @VirtualRef({ref: Children4, foreignField: "foo"})
      tests: VirtualRef<Children4>[];
    }

    // WHEN
    const testSchema = getSchema(Test8);

    // THEN
    expect(testSchema.obj).toEqual({});
    // @ts-ignore
    expect(testSchema.virtuals.tests.options).toMatchObject({
      foreignField: "foo",
      justOne: false,
      localField: "_id",
      options: undefined,
      ref: "Children4"
    });
  });
  it("should create schema with collection (Map of subdocument)", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Schema()
    class Children {
      @Name("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    @Model()
    class Test9 {
      @CollectionOf(Children)
      tests: Map<string, Children>;
    }

    // WHEN
    const testSchema = getSchema(Test9);
    const childrenSchema = getSchema(Children);

    // THEN
    expect(testSchema.obj).toEqual({
      tests: {
        type: Map,
        of: {
          type: childrenSchema,
          required: false
        }
      }
    });

    expect(childrenSchema.obj).toEqual({
      _id: {
        required: false,
        type: String
      },
      enum: {
        enum: ["v1", "v2"],
        required: false,
        type: String
      },
      name: {
        default: "defaultValue",
        match: /pattern/,
        maxlength: 100,
        minlength: 0,
        required: false,
        type: String
      },
      test: {
        max: 10,
        min: 0,
        required: false,
        type: Number
      }
    });
  });
  it("should throw error with collection (Set of subdocument)", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    let actualError: any;
    try {
      @Schema()
      class Children {
        @Name("id")
        _id: string;

        @Minimum(0)
        @Maximum(10)
        test: number;

        @MinLength(0)
        @MaxLength(100)
        @Pattern("pattern")
        @Default("defaultValue")
        name: string = "defaultValue";

        @Enum(MyEnum)
        enum: MyEnum;
      }

      class TestWithSet9 {
        @CollectionOf(Children)
        tests: Set<Children>;
      }

      getSchema(TestWithSet9);
    } catch (er) {
      actualError = er;
    }

    expect(actualError).toBeInstanceOf(Error);
    expect(actualError.message).toBe("Invalid collection type. Set is not supported.");
  });
  it("should not create schema property for ignored field", () => {
    @Model()
    class Test10 {
      @Property()
      field: string;
      @Property()
      @SchemaIgnore()
      kind: string;
    }

    const testSchema = getSchema(Test10);
    expect(testSchema.obj).toEqual({
      field: {
        required: false,
        type: String
      }
    });
  });
  it("should create schema with discriminator key", () => {
    @Model()
    class Test11 {
      @DiscriminatorKey()
      kind: string;
    }
    const testSchema = getSchema(Test11);
    // @ts-ignore
    const options = testSchema.options;

    expect(options.discriminatorKey).toBe("kind");
  });
  it("should create schema with version key", () => {
    @Model()
    class Test12 {
      @VersionKey()
      version: number;
    }
    const testSchema = getSchema(Test12);
    // @ts-ignore
    const options = testSchema.options;

    expect(options.versionKey).toBe("version");
  });

  it("should create json schema with virtual ref and count", () => {
    // GIVEN
    @Model()
    class Children5 {
      @Name("id")
      _id: string;
    }

    @Model()
    class Test13 {
      @VirtualRef({ref: Children5, foreignField: "test13", count: true})
      childrenCount: number;
    }

    // WHEN
    const testSchema: any = getJsonSchema(Test13);

    // THEN
    expect(testSchema.properties.childrenCount.type).toEqual("number");
  });
});
