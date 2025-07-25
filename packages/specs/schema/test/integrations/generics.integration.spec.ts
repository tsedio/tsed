import {validate} from "@tsed/ajv";
import {catchAsyncError} from "@tsed/core";

import {
  AdditionalProperties,
  array,
  CollectionOf,
  Description,
  Email,
  GenericOf,
  Generics,
  getJsonSchema,
  getSpec,
  In,
  JsonEntityStore,
  JsonSchema,
  MinLength,
  object,
  OperationPath,
  Path,
  Post,
  Property,
  Required,
  Returns,
  SpecTypes,
  Status,
  string,
  VendorKeys
} from "../../src/index.js";
import {validateSpec} from "../helpers/validateSpec.js";

describe("Generics: basic", () => {
  describe("JsonSchema", () => {
    it("should generate the JsonSchema from given options: Paginated", async () => {
      class Product {
        @MinLength(10)
        label: string;
      }

      @Generics("Data")
      @AdditionalProperties(false)
      class Paginated<Data> {
        @CollectionOf("Data")
        data: Product[];

        @Property()
        totalCount: number;
      }

      expect(getJsonSchema(Paginated, {})).toEqual({
        additionalProperties: false,
        properties: {
          data: {
            type: "array",
            items: {}
          },
          totalCount: {
            type: "number"
          }
        },
        type: "object"
      });
    });
    it("should generate the JsonSchema from given options: Paginated<Product>", async () => {
      class Product {
        @MinLength(10)
        label: string;
      }

      @Generics("Data")
      @AdditionalProperties(false)
      class Paginated<Data> {
        @CollectionOf("Data")
        data: Product[];

        @Property()
        totalCount: number;
      }

      const schema = getJsonSchema(Paginated, {
        generics: {
          Data: [Product]
        }
      });
      expect(schema).toMatchInlineSnapshot(`
        {
          "allOf": [
            {
              "$ref": "#/definitions/Paginated",
            },
            {
              "properties": {
                "data": {
                  "items": {
                    "$ref": "#/definitions/Product",
                  },
                  "type": "array",
                },
              },
              "type": "object",
            },
          ],
          "definitions": {
            "Paginated": {
              "additionalProperties": false,
              "properties": {
                "data": {
                  "items": {},
                  "type": "array",
                },
                "totalCount": {
                  "type": "number",
                },
              },
              "type": "object",
            },
            "Product": {
              "properties": {
                "label": {
                  "minLength": 10,
                  "type": "string",
                },
              },
              "type": "object",
            },
          },
        }
      `);

      const value = await catchAsyncError(() =>
        validate(
          {
            totalCount: 10,
            data: ["tst"]
          },
          {schema: schema as any}
        )
      );
      expect(value?.message).toEqual('Value.data.0 must be object. Given value: "tst"');

      const value2 = await catchAsyncError(() =>
        validate(
          {
            totalCount: 10,
            data: [
              {
                label: "Long label with 10 charaters"
              }
            ]
          },
          {schema: schema as any}
        )
      );
      expect(value2?.message).toEqual(undefined);
    });
    it("should generate the JsonSchema from given options: Adjustment", () => {
      @Generics("T")
      class UserProperty<T> {
        @Property()
        id: string;

        @Property("T")
        value: T;
      }

      class Adjustment {
        @GenericOf(Number)
        adjustment: UserProperty<number>;
      }

      expect(getJsonSchema(Adjustment)).toMatchInlineSnapshot(`
        {
          "definitions": {
            "UserProperty": {
              "properties": {
                "id": {
                  "type": "string",
                },
                "value": {},
              },
              "type": "object",
            },
          },
          "properties": {
            "adjustment": {
              "allOf": [
                {
                  "$ref": "#/definitions/UserProperty",
                },
                {
                  "properties": {
                    "value": {
                      "type": "number",
                    },
                  },
                  "type": "object",
                },
              ],
            },
          },
          "type": "object",
        }
      `);
    });
    it("should generate the JsonSchema from given options: UserProperty[]", () => {
      @Generics("T")
      class UserProperty<T> {
        @Property()
        id: string;

        @Property("T")
        value: T;
      }

      const itemSchema = object().description("Hello").type(UserProperty).genericOf([Number]);

      expect(itemSchema.getTarget()).toEqual(UserProperty);
      expect(JsonSchema.from(UserProperty).getGenericLabels()).toEqual(["T"]);
      expect(itemSchema.get(VendorKeys.GENERIC_OF)).toBeDefined();

      const schema = array().items(itemSchema).toJSON();

      expect(schema).toMatchInlineSnapshot(`
        {
          "definitions": {
            "UserProperty": {
              "properties": {
                "id": {
                  "type": "string",
                },
                "value": {},
              },
              "type": "object",
            },
          },
          "items": {
            "allOf": [
              {
                "$ref": "#/definitions/UserProperty",
              },
              {
                "description": "Hello",
                "properties": {
                  "value": {
                    "type": "number",
                  },
                },
                "type": "object",
              },
            ],
          },
          "type": "array",
        }
      `);
    });
    it("should generate the JsonSchema from given options: Adjustment[]", () => {
      @Generics("T")
      class UserProperty<T> {
        @Property()
        id: string;

        @Property("T")
        value: T;
      }

      class Adjustment {
        @(CollectionOf(UserProperty).Nested(Number))
        adjustments: UserProperty<number>[];
      }

      expect(getJsonSchema(Adjustment)).toMatchInlineSnapshot(`
        {
          "definitions": {
            "UserProperty": {
              "properties": {
                "id": {
                  "type": "string",
                },
                "value": {},
              },
              "type": "object",
            },
          },
          "properties": {
            "adjustments": {
              "items": {
                "allOf": [
                  {
                    "$ref": "#/definitions/UserProperty",
                  },
                  {
                    "properties": {
                      "value": {
                        "type": "number",
                      },
                    },
                    "type": "object",
                  },
                ],
              },
              "type": "array",
            },
          },
          "type": "object",
        }
      `);
    });
    it("should generate the JsonSchema with nested models: Paginated<Submission<Product>>", async () => {
      @Generics("T")
      class Paginated<T> {
        @CollectionOf("T")
        data: T[];

        @Property()
        totalCount: number;
      }

      @Generics("S")
      class Submission<S> {
        @Property()
        @Required()
        _id: string;

        @Property("S")
        @Required()
        data: S;
      }

      class Product {
        @Property()
        @MinLength(10)
        label: string;
      }

      const schema = getJsonSchema(Paginated, {
        generics: {
          T: [
            Submission,
            {
              S: [Product]
            }
          ]
        }
      });

      expect(schema).toMatchInlineSnapshot(`
        {
          "allOf": [
            {
              "$ref": "#/definitions/Paginated",
            },
            {
              "properties": {
                "data": {
                  "items": {
                    "allOf": [
                      {
                        "$ref": "#/definitions/Submission",
                      },
                      {
                        "properties": {
                          "data": {
                            "$ref": "#/definitions/Product",
                          },
                        },
                        "type": "object",
                      },
                    ],
                  },
                  "type": "array",
                },
              },
              "type": "object",
            },
          ],
          "definitions": {
            "Paginated": {
              "properties": {
                "data": {
                  "items": {},
                  "type": "array",
                },
                "totalCount": {
                  "type": "number",
                },
              },
              "type": "object",
            },
            "Product": {
              "properties": {
                "label": {
                  "minLength": 10,
                  "type": "string",
                },
              },
              "type": "object",
            },
            "Submission": {
              "properties": {
                "_id": {
                  "minLength": 1,
                  "type": "string",
                },
                "data": {},
              },
              "required": [
                "_id",
                "data",
              ],
              "type": "object",
            },
          },
        }
      `);

      const value = await catchAsyncError(() =>
        validate(
          {
            totalCount: 10,
            data: ["tst"]
          },
          {schema: schema as any}
        )
      );
      expect(!!value?.message).toEqual(true);

      const value2 = await catchAsyncError(() =>
        validate(
          {
            totalCount: 10,
            data: [
              {
                _id: "id",
                data: {
                  label: "A long label with 10 characters"
                }
              }
            ]
          },
          {schema: schema as any}
        )
      );
      expect(value2?.message).toEqual(undefined);
    });
    it("should generate the JsonSchema from a given class: Paginated<Product> + @GenericOf", () => {
      @Generics("T")
      class Submission<T> {
        @Property()
        _id: string;

        @Property("T")
        data: T;
      }

      class Product {
        @Property()
        label: string;
      }

      class Content {
        @GenericOf(Product)
        submission: Submission<Product>;
      }

      expect(getJsonSchema(Content)).toMatchInlineSnapshot(`
        {
          "definitions": {
            "Product": {
              "properties": {
                "label": {
                  "type": "string",
                },
              },
              "type": "object",
            },
            "Submission": {
              "properties": {
                "_id": {
                  "type": "string",
                },
                "data": {},
              },
              "type": "object",
            },
          },
          "properties": {
            "submission": {
              "allOf": [
                {
                  "$ref": "#/definitions/Submission",
                },
                {
                  "properties": {
                    "data": {
                      "$ref": "#/definitions/Product",
                    },
                  },
                  "type": "object",
                },
              ],
            },
          },
          "type": "object",
        }
      `);
    });
    it("should generate the JsonSchema from a given class: Paginated<Product> + @GenericOf + @Description", () => {
      @Generics("Data")
      class Paginated<Data> {
        @CollectionOf("Data")
        data: Data[];

        @Property()
        totalCount: number;
      }

      class Product {
        @Property()
        label: string;
      }

      class Content {
        @GenericOf(Product)
        @Description("description")
        products: Paginated<Product>;
      }

      expect(getJsonSchema(Content)).toMatchInlineSnapshot(`
        {
          "definitions": {
            "Paginated": {
              "properties": {
                "data": {
                  "items": {},
                  "type": "array",
                },
                "totalCount": {
                  "type": "number",
                },
              },
              "type": "object",
            },
            "Product": {
              "properties": {
                "label": {
                  "type": "string",
                },
              },
              "type": "object",
            },
          },
          "properties": {
            "products": {
              "allOf": [
                {
                  "$ref": "#/definitions/Paginated",
                },
                {
                  "description": "description",
                  "properties": {
                    "data": {
                      "items": {
                        "$ref": "#/definitions/Product",
                      },
                      "type": "array",
                    },
                  },
                  "type": "object",
                },
              ],
            },
          },
          "type": "object",
        }
      `);
    });
    it("should generate the JsonSchema with enum: Submission<MyEnum> + @Enum", () => {
      @Generics("T")
      class Submission<T> {
        @Property()
        _id: string;

        @Property("T")
        data: T;
      }

      enum MyEnum {
        READ = "read",
        WRITE = "write"
      }

      class Content {
        @GenericOf(MyEnum)
        submission: Submission<MyEnum>;
      }

      expect(getJsonSchema(Content)).toMatchInlineSnapshot(`
        {
          "definitions": {
            "Submission": {
              "properties": {
                "_id": {
                  "type": "string",
                },
                "data": {},
              },
              "type": "object",
            },
          },
          "properties": {
            "submission": {
              "allOf": [
                {
                  "$ref": "#/definitions/Submission",
                },
                {
                  "properties": {
                    "data": {
                      "enum": [
                        "read",
                        "write",
                      ],
                      "type": "string",
                    },
                  },
                  "type": "object",
                },
              ],
            },
          },
          "type": "object",
        }
      `);
    });
    it("should generate the JsonSchema with enum: Submission<MyEnum> + MyEnum as string().enum()", () => {
      @Generics("T")
      class Submission<T> {
        @Property()
        _id: string;

        @Property("T")
        data: T;
      }

      enum MyEnum {
        READ = "read",
        WRITE = "write"
      }

      class Content {
        @GenericOf(string().enum(["read", "write"]))
        submission: Submission<MyEnum>;
      }

      expect(getJsonSchema(Content)).toMatchInlineSnapshot(`
        {
          "definitions": {
            "Submission": {
              "properties": {
                "_id": {
                  "type": "string",
                },
                "data": {},
              },
              "type": "object",
            },
          },
          "properties": {
            "submission": {
              "allOf": [
                {
                  "$ref": "#/definitions/Submission",
                },
                {
                  "properties": {
                    "data": {
                      "enum": [
                        "read",
                        "write",
                      ],
                      "type": "string",
                    },
                  },
                  "type": "object",
                },
              ],
            },
          },
          "type": "object",
        }
      `);
    });
    it("should generate the JsonSchema with nested models: Paginated<Submission<Product>> + @GenericOf", () => {
      @Generics("T")
      class Paginated<T> {
        @CollectionOf("T")
        data: T[];

        @Property()
        totalCount: number;
      }

      @Generics("S")
      class Submission<S> {
        @Property()
        _id: string;

        @Property("S")
        data: S;
      }

      class Product {
        @Property()
        label: string;
      }

      class Content {
        @(GenericOf(Submission).Nested(Product))
        submissions: Paginated<Submission<Product>>;
      }

      expect(getJsonSchema(Content)).toMatchInlineSnapshot(`
        {
          "definitions": {
            "Paginated": {
              "properties": {
                "data": {
                  "items": {},
                  "type": "array",
                },
                "totalCount": {
                  "type": "number",
                },
              },
              "type": "object",
            },
            "Product": {
              "properties": {
                "label": {
                  "type": "string",
                },
              },
              "type": "object",
            },
            "Submission": {
              "properties": {
                "_id": {
                  "type": "string",
                },
                "data": {},
              },
              "type": "object",
            },
          },
          "properties": {
            "submissions": {
              "allOf": [
                {
                  "$ref": "#/definitions/Paginated",
                },
                {
                  "properties": {
                    "data": {
                      "items": {
                        "allOf": [
                          {
                            "$ref": "#/definitions/Submission",
                          },
                          {
                            "properties": {
                              "data": {
                                "$ref": "#/definitions/Product",
                              },
                            },
                            "type": "object",
                          },
                        ],
                      },
                      "type": "array",
                    },
                  },
                  "type": "object",
                },
              ],
            },
          },
          "type": "object",
        }
      `);
    });
    it("should generate the JsonSchema from parameter: Submission<Product>", () => {
      // WHEN
      @Generics("T")
      class Submission<T> {
        @Property()
        _id: string;

        @Property("T")
        data: T;
      }

      class Product {
        @Property()
        title: string;
      }

      class Controller1 {
        @OperationPath("POST", "/")
        method(@In("body") @GenericOf(Product) submission: Submission<Product>) {
          return null;
        }
      }

      const metadata = JsonEntityStore.from(Controller1, "method", 0);

      // THEN
      const schema = getJsonSchema(metadata);

      expect(schema).toMatchInlineSnapshot(`
        {
          "allOf": [
            {
              "$ref": "#/definitions/Submission",
            },
            {
              "properties": {
                "data": {
                  "$ref": "#/definitions/Product",
                },
              },
              "type": "object",
            },
          ],
          "definitions": {
            "Product": {
              "properties": {
                "title": {
                  "type": "string",
                },
              },
              "type": "object",
            },
            "Submission": {
              "properties": {
                "_id": {
                  "type": "string",
                },
                "data": {},
              },
              "type": "object",
            },
          },
        }
      `);
    });
    it("should generate the JsonSchema with Map: Map<string, Submission<Product>>", () => {
      // WHEN
      @Generics("T")
      class Submission<T> {
        @Property()
        _id: string;

        @Property("T")
        data: T;
      }

      class Product {
        @Property()
        title: string;
      }

      class Content {
        @(CollectionOf(Submission).Nested(Product))
        data: Map<string, Submission<Product>>;
      }

      // THEN
      const schema = getJsonSchema(Content);

      expect(schema).toMatchInlineSnapshot(`
        {
          "definitions": {
            "Product": {
              "properties": {
                "title": {
                  "type": "string",
                },
              },
              "type": "object",
            },
            "Submission": {
              "properties": {
                "_id": {
                  "type": "string",
                },
                "data": {},
              },
              "type": "object",
            },
          },
          "properties": {
            "data": {
              "additionalProperties": {
                "allOf": [
                  {
                    "$ref": "#/definitions/Submission",
                  },
                  {
                    "properties": {
                      "data": {
                        "$ref": "#/definitions/Product",
                      },
                    },
                    "type": "object",
                  },
                ],
              },
              "type": "object",
            },
          },
          "type": "object",
        }
      `);
    });
    it("should generate the JsonSchema with inherited generics: Model<T> extends Base<T>", () => {
      @Generics("T")
      class Base<T> {
        @Property()
        id: string;

        @Required()
        @Email()
        email: string;

        @Property("T")
        role: T;
      }

      class Model<T> extends Base<T> {
        @MinLength(0)
        declare email: string;

        @Property()
        name: string;
      }

      class Role {
        @Property()
        level: string;
      }

      class Content {
        @GenericOf(Role)
        payload: Model<Role>;
      }

      const schema = getJsonSchema(Content);

      expect(schema).toMatchInlineSnapshot(`
        {
          "definitions": {
            "Base": {
              "properties": {
                "email": {
                  "format": "email",
                  "minLength": 1,
                  "type": "string",
                },
                "id": {
                  "type": "string",
                },
                "role": {},
              },
              "required": [
                "email",
              ],
              "type": "object",
            },
            "Role": {
              "properties": {
                "level": {
                  "type": "string",
                },
              },
              "type": "object",
            },
          },
          "properties": {
            "payload": {
              "allOf": [
                {
                  "$ref": "#/definitions/Base",
                },
                {
                  "properties": {
                    "role": {
                      "$ref": "#/definitions/Role",
                    },
                  },
                  "type": "object",
                },
              ],
            },
          },
          "type": "object",
        }
      `);
    });
  });

  describe("OpenSpec", () => {
    it("should generate the open spec: UserProperty<number> + @GenericOf", async () => {
      @Generics("T")
      class UserProperty<T> {
        @Property()
        id: string;

        @Property("T")
        value: T;
      }

      class Adjustment {
        @GenericOf(Number)
        adjustment: UserProperty<number>;
      }

      @Path("/hello-world")
      class HelloWorldController {
        @Post("/")
        get(@In("body") m: Adjustment) {
          return m;
        }
      }

      const spec = getSpec(HelloWorldController, {specType: SpecTypes.OPENAPI});

      expect(spec).toMatchInlineSnapshot(`
        {
          "components": {
            "schemas": {
              "Adjustment": {
                "properties": {
                  "adjustment": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/UserProperty",
                      },
                      {
                        "properties": {
                          "value": {
                            "type": "number",
                          },
                        },
                        "type": "object",
                      },
                    ],
                  },
                },
                "type": "object",
              },
              "UserProperty": {
                "properties": {
                  "id": {
                    "type": "string",
                  },
                  "value": {},
                },
                "type": "object",
              },
            },
          },
          "paths": {
            "/hello-world": {
              "post": {
                "operationId": "helloWorldControllerGet",
                "parameters": [],
                "requestBody": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/Adjustment",
                      },
                    },
                  },
                  "required": false,
                },
                "responses": {
                  "200": {
                    "description": "Success",
                  },
                },
                "tags": [
                  "HelloWorldController",
                ],
              },
            },
          },
          "tags": [
            {
              "name": "HelloWorldController",
            },
          ],
        }
      `);
      expect(await validateSpec(spec, SpecTypes.OPENAPI)).toBe(true);
    });
    it("should generate the open spec: Submission<Product>", () => {
      // WHEN
      @Generics("T")
      class Submission<T> {
        @Property()
        _id: string;

        @Property("T")
        data: T;
      }

      class Product {
        @Property()
        title: string;
      }

      class Controller1 {
        @OperationPath("POST", "/")
        method(@In("body") @GenericOf(Product) submission: Submission<Product>) {
          return null;
        }
      }

      // THEN
      const spec1 = getSpec(Controller1, {specType: SpecTypes.OPENAPI});

      expect(spec1).toMatchInlineSnapshot(`
        {
          "components": {
            "schemas": {
              "Product": {
                "properties": {
                  "title": {
                    "type": "string",
                  },
                },
                "type": "object",
              },
              "Submission": {
                "properties": {
                  "_id": {
                    "type": "string",
                  },
                  "data": {},
                },
                "type": "object",
              },
            },
          },
          "paths": {
            "/": {
              "post": {
                "operationId": "controller1Method",
                "parameters": [],
                "requestBody": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "allOf": [
                          {
                            "$ref": "#/components/schemas/Submission",
                          },
                          {
                            "properties": {
                              "data": {
                                "$ref": "#/components/schemas/Product",
                              },
                            },
                            "type": "object",
                          },
                        ],
                      },
                    },
                  },
                  "required": false,
                },
                "responses": {
                  "200": {
                    "description": "Success",
                  },
                },
                "tags": [
                  "Controller1",
                ],
              },
            },
          },
          "tags": [
            {
              "name": "Controller1",
            },
          ],
        }
      `);
    });
    it("should generate the open spec: Pagination<Submission<Product>", () => {
      // WHEN
      @Generics("T")
      class Pagination<T> {
        @CollectionOf("T")
        data: T[];

        @Property()
        totalCount: number;
      }

      @Generics("T")
      class Submission<T> {
        @Property()
        _id: string;

        @Property("T")
        data: T;
      }

      class Product {
        @Property()
        title: string;
      }

      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, Pagination).Of(Submission).Nested(Product).Description("description"))
        method(): Promise<Pagination<Submission<Product>> | null> {
          return null as never;
        }
      }

      // THEN
      const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

      expect(spec).toMatchInlineSnapshot(`
        {
          "components": {
            "schemas": {
              "Pagination": {
                "properties": {
                  "data": {
                    "items": {},
                    "type": "array",
                  },
                  "totalCount": {
                    "type": "number",
                  },
                },
                "type": "object",
              },
              "Product": {
                "properties": {
                  "title": {
                    "type": "string",
                  },
                },
                "type": "object",
              },
              "Submission": {
                "properties": {
                  "_id": {
                    "type": "string",
                  },
                  "data": {},
                },
                "type": "object",
              },
            },
          },
          "paths": {
            "/": {
              "post": {
                "operationId": "controllerMethod",
                "parameters": [],
                "responses": {
                  "200": {
                    "content": {
                      "application/json": {
                        "schema": {
                          "allOf": [
                            {
                              "$ref": "#/components/schemas/Pagination",
                            },
                            {
                              "properties": {
                                "data": {
                                  "items": {
                                    "allOf": [
                                      {
                                        "$ref": "#/components/schemas/Submission",
                                      },
                                      {
                                        "properties": {
                                          "data": {
                                            "$ref": "#/components/schemas/Product",
                                          },
                                        },
                                        "type": "object",
                                      },
                                    ],
                                  },
                                  "type": "array",
                                },
                              },
                              "type": "object",
                            },
                          ],
                        },
                      },
                    },
                    "description": "description",
                  },
                },
                "tags": [
                  "Controller",
                ],
              },
            },
          },
          "tags": [
            {
              "name": "Controller",
            },
          ],
        }
      `);
    });
    it("should generate the open spec: Pagination<Submission<Product> + @Status", () => {
      // WHEN
      @Generics("T")
      class Pagination<T> {
        @CollectionOf("T")
        data: T[];

        @Property()
        totalCount: number;
      }

      @Generics("T")
      class Submission<T> {
        @Property()
        _id: string;

        @Property("T")
        data: T;
      }

      class Product {
        @Property()
        title: string;
      }

      class Controller {
        @OperationPath("POST", "/")
        @(Status(200, Pagination).Of(Submission).Nested(Product).Description("description"))
        method(): Promise<Pagination<Submission<Product>> | null> {
          return null as never;
        }
      }

      // THEN
      const spec = getSpec(Controller);

      expect(spec).toMatchInlineSnapshot(`
        {
          "components": {
            "schemas": {
              "Pagination": {
                "properties": {
                  "data": {
                    "items": {},
                    "type": "array",
                  },
                  "totalCount": {
                    "type": "number",
                  },
                },
                "type": "object",
              },
              "Product": {
                "properties": {
                  "title": {
                    "type": "string",
                  },
                },
                "type": "object",
              },
              "Submission": {
                "properties": {
                  "_id": {
                    "type": "string",
                  },
                  "data": {},
                },
                "type": "object",
              },
            },
          },
          "paths": {
            "/": {
              "post": {
                "operationId": "controllerMethod",
                "parameters": [],
                "responses": {
                  "200": {
                    "content": {
                      "application/json": {
                        "schema": {
                          "allOf": [
                            {
                              "$ref": "#/components/schemas/Pagination",
                            },
                            {
                              "properties": {
                                "data": {
                                  "items": {
                                    "allOf": [
                                      {
                                        "$ref": "#/components/schemas/Submission",
                                      },
                                      {
                                        "properties": {
                                          "data": {
                                            "$ref": "#/components/schemas/Product",
                                          },
                                        },
                                        "type": "object",
                                      },
                                    ],
                                  },
                                  "type": "array",
                                },
                              },
                              "type": "object",
                            },
                          ],
                        },
                      },
                    },
                    "description": "description",
                  },
                },
                "tags": [
                  "Controller",
                ],
              },
            },
          },
          "tags": [
            {
              "name": "Controller",
            },
          ],
        }
      `);
    });
    it("should generate the open spec: Pagination<Submission<Product> + @Returns + @Examples", () => {
      // WHEN
      @Generics("T")
      class Pagination<T> {
        @CollectionOf("T")
        data: T[];

        @Property()
        totalCount: number;
      }

      @Generics("T")
      class Submission<T> {
        @Property()
        _id: string;

        @Property("T")
        data: T;
      }

      class Product {
        @Property()
        title: string;
      }

      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, Pagination)
          .Of(Submission)
          .Nested(Product)
          .Description("description")
          .Examples({
            Example1: {
              value: [
                {
                  totalCount: 0,
                  data: [
                    {
                      _id: "id",
                      data: {}
                    }
                  ]
                }
              ]
            }
          }))
        method(): Promise<Pagination<Submission<Product>> | null> {
          return null as never;
        }
      }

      // THEN
      const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

      expect(spec).toMatchInlineSnapshot(`
        {
          "components": {
            "schemas": {
              "Pagination": {
                "properties": {
                  "data": {
                    "items": {},
                    "type": "array",
                  },
                  "totalCount": {
                    "type": "number",
                  },
                },
                "type": "object",
              },
              "Product": {
                "properties": {
                  "title": {
                    "type": "string",
                  },
                },
                "type": "object",
              },
              "Submission": {
                "properties": {
                  "_id": {
                    "type": "string",
                  },
                  "data": {},
                },
                "type": "object",
              },
            },
          },
          "paths": {
            "/": {
              "post": {
                "operationId": "controllerMethod",
                "parameters": [],
                "responses": {
                  "200": {
                    "content": {
                      "application/json": {
                        "examples": {
                          "Example1": {
                            "value": [
                              {
                                "data": [
                                  {
                                    "_id": "id",
                                    "data": {},
                                  },
                                ],
                                "totalCount": 0,
                              },
                            ],
                          },
                        },
                        "schema": {
                          "allOf": [
                            {
                              "$ref": "#/components/schemas/Pagination",
                            },
                            {
                              "properties": {
                                "data": {
                                  "items": {
                                    "allOf": [
                                      {
                                        "$ref": "#/components/schemas/Submission",
                                      },
                                      {
                                        "properties": {
                                          "data": {
                                            "$ref": "#/components/schemas/Product",
                                          },
                                        },
                                        "type": "object",
                                      },
                                    ],
                                  },
                                  "type": "array",
                                },
                              },
                              "type": "object",
                            },
                          ],
                        },
                      },
                    },
                    "description": "description",
                  },
                },
                "tags": [
                  "Controller",
                ],
              },
            },
          },
          "tags": [
            {
              "name": "Controller",
            },
          ],
        }
      `);
    });
    it("should generate the open spec: Submission<MyEnum>", () => {
      // WHEN
      @Generics("T")
      class Submission<T> {
        @Property()
        _id: string;

        @Property("T")
        data: T;
      }

      enum MyEnum {
        READ = "read",
        WRITE = "write"
      }

      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, Submission).Of(MyEnum).Description("description"))
        method(): Promise<Submission<MyEnum> | null> {
          return Promise.resolve(null);
        }
      }

      // THEN
      const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

      expect(spec).toMatchInlineSnapshot(`
        {
          "components": {
            "schemas": {
              "Submission": {
                "properties": {
                  "_id": {
                    "type": "string",
                  },
                  "data": {},
                },
                "type": "object",
              },
            },
          },
          "paths": {
            "/": {
              "post": {
                "operationId": "controllerMethod",
                "parameters": [],
                "responses": {
                  "200": {
                    "content": {
                      "application/json": {
                        "schema": {
                          "allOf": [
                            {
                              "$ref": "#/components/schemas/Submission",
                            },
                            {
                              "properties": {
                                "data": {
                                  "enum": [
                                    "read",
                                    "write",
                                  ],
                                  "type": "string",
                                },
                              },
                              "type": "object",
                            },
                          ],
                        },
                      },
                    },
                    "description": "description",
                  },
                },
                "tags": [
                  "Controller",
                ],
              },
            },
          },
          "tags": [
            {
              "name": "Controller",
            },
          ],
        }
      `);
    });
    it("should generate the open spec: Pagination<Submission<MyEnum>>", () => {
      // WHEN
      @Generics("T")
      class Pagination<T> {
        @CollectionOf("T")
        data: T[];

        @Property()
        totalCount: number;
      }

      @Generics("T")
      class Submission<T> {
        @Property()
        _id: string;

        @Property("T")
        data: T;
      }

      enum MyEnum {
        READ = "read",
        WRITE = "write"
      }

      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, Pagination)
          .Of(Submission)
          .Nested(MyEnum)
          .Description("description")
          .Examples({
            Example1: {
              value: [
                {
                  totalCount: 0,
                  data: [
                    {
                      _id: "id",
                      data: {}
                    }
                  ]
                }
              ]
            }
          }))
        method(): Promise<Pagination<Submission<MyEnum>> | null> {
          return null as never;
        }
      }

      // THEN
      const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

      expect(spec).toMatchInlineSnapshot(`
        {
          "components": {
            "schemas": {
              "Pagination": {
                "properties": {
                  "data": {
                    "items": {},
                    "type": "array",
                  },
                  "totalCount": {
                    "type": "number",
                  },
                },
                "type": "object",
              },
              "Submission": {
                "properties": {
                  "_id": {
                    "type": "string",
                  },
                  "data": {},
                },
                "type": "object",
              },
            },
          },
          "paths": {
            "/": {
              "post": {
                "operationId": "controllerMethod",
                "parameters": [],
                "responses": {
                  "200": {
                    "content": {
                      "application/json": {
                        "examples": {
                          "Example1": {
                            "value": [
                              {
                                "data": [
                                  {
                                    "_id": "id",
                                    "data": {},
                                  },
                                ],
                                "totalCount": 0,
                              },
                            ],
                          },
                        },
                        "schema": {
                          "allOf": [
                            {
                              "$ref": "#/components/schemas/Pagination",
                            },
                            {
                              "properties": {
                                "data": {
                                  "items": {
                                    "allOf": [
                                      {
                                        "$ref": "#/components/schemas/Submission",
                                      },
                                      {
                                        "properties": {
                                          "data": {
                                            "enum": [
                                              "read",
                                              "write",
                                            ],
                                            "type": "string",
                                          },
                                        },
                                        "type": "object",
                                      },
                                    ],
                                  },
                                  "type": "array",
                                },
                              },
                              "type": "object",
                            },
                          ],
                        },
                      },
                    },
                    "description": "description",
                  },
                },
                "tags": [
                  "Controller",
                ],
              },
            },
          },
          "tags": [
            {
              "name": "Controller",
            },
          ],
        }
      `);
    });
    it("should generate the open spec: Pagination<Submission<Product>> + @Title", () => {
      // WHEN
      @Generics("T")
      class Pagination<T> {
        @CollectionOf("T")
        data: T[];

        @Property()
        totalCount: number;
      }

      @Generics("T")
      class Submission<T> {
        @Property()
        _id: string;

        @Property("T")
        data: T;
      }

      class Product {
        @Property()
        title: string;
      }

      class Controller {
        @OperationPath("POST", "/")
        @(Returns(200, Pagination)
          .Of(Submission)
          .Nested(Product)
          .Label("PaginatedSubmissionProduct")
          .Schema({
            $comment: "Hello comment"
          })
          .Description("description"))
        method(): Promise<Pagination<Submission<Product>> | null> {
          return null as never;
        }
      }

      // THEN
      const spec = getSpec(Controller, {specType: SpecTypes.OPENAPI});

      expect(spec).toMatchInlineSnapshot(`
        {
          "components": {
            "schemas": {
              "PaginatedSubmissionProduct": {
                "allOf": [
                  {
                    "$ref": "#/components/schemas/Pagination",
                  },
                  {
                    "$comment": "Hello comment",
                    "properties": {
                      "data": {
                        "items": {
                          "allOf": [
                            {
                              "$ref": "#/components/schemas/Submission",
                            },
                            {
                              "properties": {
                                "data": {
                                  "$ref": "#/components/schemas/Product",
                                },
                              },
                              "type": "object",
                            },
                          ],
                        },
                        "type": "array",
                      },
                    },
                    "type": "object",
                  },
                ],
              },
              "Pagination": {
                "properties": {
                  "data": {
                    "items": {},
                    "type": "array",
                  },
                  "totalCount": {
                    "type": "number",
                  },
                },
                "type": "object",
              },
              "Product": {
                "properties": {
                  "title": {
                    "type": "string",
                  },
                },
                "type": "object",
              },
              "Submission": {
                "properties": {
                  "_id": {
                    "type": "string",
                  },
                  "data": {},
                },
                "type": "object",
              },
            },
          },
          "paths": {
            "/": {
              "post": {
                "operationId": "controllerMethod",
                "parameters": [],
                "responses": {
                  "200": {
                    "content": {
                      "application/json": {
                        "schema": {
                          "$ref": "#/components/schemas/PaginatedSubmissionProduct",
                        },
                      },
                    },
                    "description": "description",
                  },
                },
                "tags": [
                  "Controller",
                ],
              },
            },
          },
          "tags": [
            {
              "name": "Controller",
            },
          ],
        }
      `);
    });
  });
});
