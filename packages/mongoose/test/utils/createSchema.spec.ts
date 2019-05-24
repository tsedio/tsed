import {
  Default,
  Enum,
  Maximum,
  MaxLength,
  Minimum,
  MinLength,
  Pattern,
  Property,
  PropertyName,
  PropertyType,
  Required
} from "@tsed/common";
import {Schema as SchemaMongoose} from "mongoose";
import {OpenApiModelSchemaBuilder} from "../../../swagger/src/class/OpenApiModelSchemaBuilder";
import {Model, ObjectID, Ref, Schema, VirtualRef} from "../../src/decorators";
import {createSchema, getSchema} from "../../src/utils/createSchema";

describe("createSchema", () => {
  it("should create schema", () => {
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    // GIVEN
    @Model()
    class Test {
      @PropertyName("id")
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
    result.obj.should.deep.eq({
      "enum": {
        "enum": [
          "v1",
          "v2"
        ],
        "required": false,
        "type": String
      },
      "name": {
        "default": "defaultValue",
        "match": /pattern/,
        "maxlength": 100,
        "minlength": 0,
        "required": false,
        "type": String
      },
      "test": {
        "max": 10,
        "min": 0,
        "required": false,
        "type": Number
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
    const result = getSchema(Test2);

    // THEN
    result.obj.test.required.should.be.a("function");
  });
  it("should create schema with subdocument", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Schema()
    class Children {
      @PropertyName("id")
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
    testSchema.obj.should.deep.eq({
      test: {
        type: childrenSchema,
        required: false
      }
    });

    childrenSchema.obj.should.deep.eq({
      "enum": {
        "enum": [
          "v1",
          "v2"
        ],
        "required": false,
        "type": String
      },
      "name": {
        "default": "defaultValue",
        "match": /pattern/,
        "maxlength": 100,
        "minlength": 0,
        "required": false,
        "type": String
      },
      "test": {
        "max": 10,
        "min": 0,
        "required": false,
        "type": Number
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
    testSchema.obj.should.deep.eq({
      test: {
        type: SchemaMongoose.Types.ObjectId,
        ref: "Children",
        required: false
      }
    });

    childrenSchema.obj.should.deep.eq({
      "enum": {
        "enum": [
          "v1",
          "v2"
        ],
        "required": false,
        "type": String
      },
      "name": {
        "default": "defaultValue",
        "match": /pattern/,
        "maxlength": 100,
        "minlength": 0,
        "required": false,
        "type": String
      },
      "test": {
        "max": 10,
        "min": 0,
        "required": false,
        "type": Number
      }
    });

    const result = new OpenApiModelSchemaBuilder(Test4).build();

    result.should.deep.eq({
      "_definitions": {
        "Test4": {
          "properties": {
            "test": {
              "description": "Mongoose Ref ObjectId",
              "example": "5ce7ad3028890bd71749d477",
              "type": "string"
            }
          },
          "type": "object"
        }
      },
      "_responses": {},
      "_schema": {
        "properties": {
          "test": {
            "description": "Mongoose Ref ObjectId",
            "example": "5ce7ad3028890bd71749d477",
            "type": "string"
          }
        },
        "type": "object"
      },
      "target": Test4
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
      @PropertyName("id")
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
      @VirtualRef({type: Children2, foreignField: "foo"})
      test: VirtualRef<Children2>;
    }

    // WHEN
    const testSchema: any = getSchema(Test5);

    // THEN
    testSchema.obj.should.deep.eq({});
    testSchema.virtuals.test.options.should.deep.eq({
      "foreignField": "foo",
      "justOne": true,
      "localField": "test",
      "options": undefined,
      "ref": "Children2"
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
      @PropertyName("id")
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
      @PropertyType(Children)
      tests: Children[];
    }

    // WHEN
    const testSchema = getSchema(Test6);
    const childrenSchema = getSchema(Children);

    // THEN
    testSchema.obj.should.deep.eq({
      tests: [
        {
          type: childrenSchema,
          required: false
        }
      ]
    });

    childrenSchema.obj.should.deep.eq({
      "enum": {
        "enum": [
          "v1",
          "v2"
        ],
        "required": false,
        "type": String
      },
      "name": {
        "default": "defaultValue",
        "match": /pattern/,
        "maxlength": 100,
        "minlength": 0,
        "required": false,
        "type": String
      },
      "test": {
        "max": 10,
        "min": 0,
        "required": false,
        "type": Number
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
      @PropertyName("id")
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
    testSchema.obj.should.deep.eq({
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
      @PropertyName("id")
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
      @VirtualRef({type: Children4, foreignField: "foo"})
      tests: VirtualRef<Children4>[];
    }

    // WHEN
    const testSchema = getSchema(Test8);

    // THEN
    testSchema.obj.should.deep.eq({});
    // @ts-ignore
    testSchema.virtuals.tests.options.should.deep.eq({
      "foreignField": "foo",
      "justOne": false,
      "localField": "tests",
      "options": undefined,
      "ref": "Children4"
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
      @PropertyName("id")
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
      @PropertyType(Children)
      tests: Map<string, Children>;
    }

    // WHEN
    const testSchema = getSchema(Test9);
    const childrenSchema = getSchema(Children);

    // THEN
    testSchema.obj.should.deep.eq({
      tests: {
        type: Map,
        of: {
          type: childrenSchema,
          required: false
        }
      }
    });

    childrenSchema.obj.should.deep.eq({
      "enum": {
        "enum": [
          "v1",
          "v2"
        ],
        "required": false,
        "type": String
      },
      "name": {
        "default": "defaultValue",
        "match": /pattern/,
        "maxlength": 100,
        "minlength": 0,
        "required": false,
        "type": String
      },
      "test": {
        "max": 10,
        "min": 0,
        "required": false,
        "type": Number
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
        @PropertyName("id")
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
        @PropertyType(Children)
        tests: Set<Children>;
      }

    } catch (er) {
      actualError = er;
    }

    actualError.should.instanceof(Error);
    actualError.message.should.eq("Invalid collection type. Set is not supported.");
  });
});
