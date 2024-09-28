import "../index.js";

import {CollectionOf} from "../decorators/collections/collectionOf.js";
import {Property} from "../decorators/common/property.js";
import {
  allOf,
  any,
  anyOf,
  array,
  boolean,
  date,
  datetime,
  email,
  from,
  integer,
  lazyRef,
  map,
  number,
  object,
  set,
  string,
  time,
  uri,
  url
} from "./from.js";

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
      uniqueItems: true
    });
    expect(map().toJSON()).toEqual({
      additionalProperties: true,
      type: "object"
    });
    expect(array().toJSON()).toEqual({type: "array"});
    expect(any().toJSON()).toEqual({
      anyOf: [
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
          type: "array"
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
  it("should declare a lazyRef", () => {
    const schema1 = object({
      owners: array().items(lazyRef(() => Owner))
    });

    class Post {
      @Property()
      id: string;

      @Property(() => Owner)
      owner: typeof Owner;
    }

    class Owner {
      @Property()
      id: string;

      @CollectionOf(() => Post)
      posts: Post[];
    }

    expect(schema1.toJSON()).toEqual({
      definitions: {
        Owner: {
          properties: {
            id: {
              type: "string"
            },
            posts: {
              items: {
                $ref: "#/definitions/Post"
              },
              type: "array"
            }
          },
          type: "object"
        },
        Post: {
          properties: {
            id: {
              type: "string"
            },
            owner: {
              $ref: "#/definitions/Owner"
            }
          },
          type: "object"
        }
      },
      properties: {
        owners: {
          items: {
            $ref: "#/definitions/Owner"
          },
          type: "array"
        }
      },
      type: "object"
    });
  });
});
