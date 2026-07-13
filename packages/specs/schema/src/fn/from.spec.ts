import "../index.js";

import {CollectionOf} from "../decorators/collections/collectionOf.js";
import {Property} from "../decorators/common/property.js";
import {Generics} from "../decorators/generics/generics.js";
import {allOf} from "./allOf.js";
import {any} from "./any.js";
import {anyOf} from "./anyOf.js";
import {boolean} from "./boolean.js";
import {array, map, set} from "./collection.js";
import {date, datetime, time} from "./date.js";
import {email} from "./email.js";
import {from} from "./from.js";
import {generic} from "./generic.js";
import {integer} from "./integer.js";
import {number} from "./number.js";
import {object} from "./object.js";
import {string} from "./string.js";
import {uri} from "./uri.js";
import {url} from "./url.js";

describe("from", () => {
  it("should declare a model", () => {
    expect(from().toJSON()).toEqual({type: "object"});
    expect(string().toJSON()).toEqual({type: "string"});
    expect(number().toJSON()).toEqual({type: "number"});
    expect(integer().toJSON()).toEqual({
      multipleOf: 1,
      type: "integer"
    });
    expect(boolean().toJSON()).toEqual({type: "boolean"});
    expect(date().toJSON()).toEqual({
      format: "date",
      type: "string"
    });
    expect(datetime().toJSON()).toEqual({
      format: "date-time",
      type: "string"
    });
    expect(time().toJSON()).toEqual({
      format: "time",
      type: "string"
    });
    expect(email().toJSON()).toEqual({
      format: "email",
      type: "string"
    });
    expect(email().toJSON()).toEqual({
      format: "email",
      type: "string"
    });
    expect(uri().toJSON()).toEqual({
      format: "uri",
      type: "string"
    });
    expect(url().toJSON()).toEqual({
      format: "url",
      type: "string"
    });
    expect(set().toJSON()).toEqual({
      type: "array",
      items: {},
      uniqueItems: true
    });
    expect(set().items(string()).toJSON()).toEqual({
      type: "array",
      items: {
        type: "string"
      },
      uniqueItems: true
    });
    expect(map().toJSON()).toEqual({
      additionalProperties: true,
      type: "object"
    });
    expect(map().additionalProperties(string()).toJSON()).toEqual({
      additionalProperties: {
        type: "string"
      },
      type: "object"
    });
    expect(array().toJSON()).toEqual({type: "array", items: {}});
    expect(any().toJSON()).toEqual({
      oneOf: [
        {
          type: "null"
        },
        {
          multipleOf: 1,
          type: "integer"
        },
        {
          type: "number"
        },
        {
          type: "string"
        },
        {
          type: "boolean"
        },
        {
          type: "array",
          items: {}
        },
        {
          type: "object"
        }
      ]
    });

    expect(anyOf(string(), number()).toJSON()).toEqual({
      anyOf: [{type: "string"}, {type: "number"}]
    });

    expect(allOf(string(), number()).toJSON()).toEqual({
      allOf: [{type: "string"}, {type: "number"}]
    });
  });
  it("should create ref when use a label", () => {
    const ErrorSchema = object({
      name: string().required().description("The error name"),
      message: string().required().description("An error message")
    })
      .label("GenericError")
      .unknown();

    const ExceptionSchema = object()
      .allOf([ErrorSchema])
      .properties({
        name: string().required().description("The error name"),
        message: string().required().description("An error message"),
        status: number().required().description("The status code of the exception"),
        errors: array().items(ErrorSchema).description("A list of related errors"),
        stack: string().description("The stack trace (only in development mode)")
      });

    expect(ExceptionSchema.toJSON()).toEqual({
      allOf: [
        {
          $ref: "#/definitions/GenericError"
        }
      ],
      definitions: {
        GenericError: {
          additionalProperties: true,
          properties: {
            message: {
              description: "An error message",
              minLength: 1,
              type: "string"
            },
            name: {
              description: "The error name",
              minLength: 1,
              type: "string"
            }
          },
          required: ["name", "message"],
          type: "object"
        }
      },
      properties: {
        errors: {
          description: "A list of related errors",
          items: {
            $ref: "#/definitions/GenericError"
          },
          type: "array"
        },
        message: {
          description: "An error message",
          minLength: 1,
          type: "string"
        },
        name: {
          description: "The error name",
          minLength: 1,
          type: "string"
        },
        stack: {
          description: "The stack trace (only in development mode)",
          type: "string"
        },
        status: {
          description: "The status code of the exception",
          type: "number"
        }
      },
      required: ["name", "message", "status"],
      type: "object"
    });
  });

  it("should generate a standalone generic schema from functional API", () => {
    @Generics("T")
    class Pagination<T> {
      @CollectionOf("T")
      data: T[];

      @Property()
      totalCount: number;
    }

    class Product {
      @Property()
      id: string;

      @Property()
      title: string;
    }

    expect(from(Pagination).genericOf([Product]).description("description").toJSON()).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "$ref": "#/definitions/Pagination",
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
          "Pagination": {
            "description": "description",
            "properties": {
              "data": {
                "items": {
                  "type": "object",
                },
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
              "id": {
                "type": "string",
              },
              "title": {
                "type": "string",
              },
            },
            "type": "object",
          },
        },
      }
    `);
  });

  it("should render standalone generics without forwarding options", () => {
    @Generics("T")
    class Pagination<T> {
      @CollectionOf("T")
      data: T[];

      @Property()
      totalCount: number;
    }

    class Product {
      @Property()
      id: string;

      @Property()
      title: string;
    }

    const schema = from(Pagination).genericOf([Product]).description("description");

    expect(schema.toJSON()).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "$ref": "#/definitions/Pagination",
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
          "Pagination": {
            "description": "description",
            "properties": {
              "data": {
                "items": {
                  "type": "object",
                },
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
              "id": {
                "type": "string",
              },
              "title": {
                "type": "string",
              },
            },
            "type": "object",
          },
        },
      }
    `);
  });

  // it.fails("should isolate generic helper schemas across calls", () => {
  //   @Generics("T")
  //   class Pagination<T> {
  //     @CollectionOf("T")
  //     data: T[];
  //
  //     @Property()
  //     totalCount: number;
  //   }
  //
  //   class Product {
  //     @Property()
  //     id: string;
  //   }
  //
  //   class Assets {
  //     @Property()
  //     url: string;
  //   }
  //
  //   const schema1 = generic(Pagination).of([Product]).description("description");
  //   const schema2 = generic(Pagination).of([Assets]).description("description");
  //
  //   expect(schema1).not.toBe(schema2);
  //   expect(schema1.toJSON()).toMatchInlineSnapshot(`
  //     {
  //       "allOf": [
  //         {
  //           "$ref": "#/definitions/Pagination",
  //         },
  //         {
  //           "properties": {
  //             "data": {
  //               "items": {
  //                 "$ref": "#/definitions/Product",
  //               },
  //               "type": "array",
  //             },
  //           },
  //           "type": "object",
  //         },
  //       ],
  //       "definitions": {
  //         "Pagination": {
  //           "description": "description",
  //           "properties": {
  //             "data": {
  //               "items": {
  //                 "type": "object",
  //               },
  //               "type": "array",
  //             },
  //             "totalCount": {
  //               "type": "number",
  //             },
  //           },
  //           "type": "object",
  //         },
  //         "Product": {
  //           "properties": {
  //             "id": {
  //               "type": "string",
  //             },
  //           },
  //           "type": "object",
  //         },
  //       },
  //     }
  //   `);
  //   expect(schema2.toJSON()).toMatchInlineSnapshot(`
  //     {
  //       "allOf": [
  //         {
  //           "$ref": "#/definitions/Pagination",
  //         },
  //         {
  //           "properties": {
  //             "data": {
  //               "items": {
  //                 "$ref": "#/definitions/Assets",
  //               },
  //               "type": "array",
  //             },
  //           },
  //           "type": "object",
  //         },
  //       ],
  //       "definitions": {
  //         "Assets": {
  //           "properties": {
  //             "url": {
  //               "type": "string",
  //             },
  //           },
  //           "type": "object",
  //         },
  //         "Pagination": {
  //           "description": "description",
  //           "properties": {
  //             "data": {
  //               "items": {
  //                 "type": "object",
  //               },
  //               "type": "array",
  //             },
  //             "totalCount": {
  //               "type": "number",
  //             },
  //           },
  //           "type": "object",
  //         },
  //       },
  //     }
  //   `);
  // });

  it("should isolate generics across from(Class) calls like Returns.Of", () => {
    @Generics("T")
    class Pagination<T> {
      @CollectionOf("T")
      data: T[];

      @Property()
      totalCount: number;
    }

    class Product {
      @Property()
      id: string;
    }

    class Assets {
      @Property()
      url: string;
    }

    const schema1 = from(Pagination).genericOf([Product]).description("description");
    const schema2 = from(Pagination).genericOf([Assets]).description("description");

    expect(schema1).not.toBe(schema2);
    expect(schema1.toJSON()).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "$ref": "#/definitions/Pagination",
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
          "Pagination": {
            "description": "description",
            "properties": {
              "data": {
                "items": {
                  "type": "object",
                },
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
              "id": {
                "type": "string",
              },
            },
            "type": "object",
          },
        },
      }
    `);
    expect(schema2.toJSON()).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "$ref": "#/definitions/Pagination",
          },
          {
            "properties": {
              "data": {
                "items": {
                  "$ref": "#/definitions/Assets",
                },
                "type": "array",
              },
            },
            "type": "object",
          },
        ],
        "definitions": {
          "Assets": {
            "properties": {
              "url": {
                "type": "string",
              },
            },
            "type": "object",
          },
          "Pagination": {
            "description": "description",
            "properties": {
              "data": {
                "items": {
                  "type": "object",
                },
                "type": "array",
              },
              "totalCount": {
                "type": "number",
              },
            },
            "type": "object",
          },
        },
      }
    `);
  });

  it("should match the local generic wrapper behavior", () => {
    @Generics("T")
    class Pagination<T> {
      @CollectionOf("T")
      data: T[];

      @Property()
      totalCount: number;
    }

    class Product {
      @Property()
      id: string;
    }

    expect(from(Pagination).genericOf([Product]).toJSON()).toEqual(generic(Pagination).of([Product]).toJSON());
  });

  // it.fails("should support explicit generic label mapping", () => {
  //   @Generics("Data", "Args")
  //   class Payload<Data, Args> {
  //     @Property("Data")
  //     data: Data;
  //
  //     @Property("Args")
  //     args: Args;
  //   }
  //
  //   @Generics("Nested")
  //   class ArgsModel<Nested> {
  //     @Property("Nested")
  //     nested: Nested;
  //   }
  //
  //   class Product {
  //     @Property()
  //     id: string;
  //   }
  //
  //   class NestedModel {
  //     @Property()
  //     value: string;
  //   }
  //
  //   expect(
  //     generic(Payload)
  //       .of({
  //         Data: Product,
  //         Args: [ArgsModel, {Nested: NestedModel}]
  //       })
  //       .toJSON()
  //   ).toMatchInlineSnapshot(`
  //     {
  //       "allOf": [
  //         {
  //           "$ref": "#/definitions/Payload",
  //         },
  //         {
  //           "properties": {
  //             "args": {
  //               "allOf": [
  //                 {
  //                   "$ref": "#/definitions/ArgsModel",
  //                 },
  //                 {
  //                   "properties": {
  //                     "nested": {
  //                       "$ref": "#/definitions/NestedModel",
  //                     },
  //                   },
  //                   "type": "object",
  //                 },
  //               ],
  //             },
  //             "data": {
  //               "$ref": "#/definitions/Product",
  //             },
  //           },
  //           "type": "object",
  //         },
  //       ],
  //       "definitions": {
  //         "ArgsModel": {
  //           "properties": {
  //             "nested": {},
  //           },
  //           "type": "object",
  //         },
  //         "NestedModel": {
  //           "properties": {
  //             "value": {
  //               "type": "string",
  //             },
  //           },
  //           "type": "object",
  //         },
  //         "Payload": {
  //           "properties": {
  //             "args": {},
  //             "data": {},
  //           },
  //           "type": "object",
  //         },
  //         "Product": {
  //           "properties": {
  //             "id": {
  //               "type": "string",
  //             },
  //           },
  //           "type": "object",
  //         },
  //       },
  //     }
  //   `);
  // });
});
