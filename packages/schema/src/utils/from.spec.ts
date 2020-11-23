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
  map,
  number,
  object,
  set,
  string,
  time,
  uri,
  url
} from "@tsed/schema";
import {expect} from "chai";

describe("from", () => {
  it("should declare a model", () => {
    expect(from().toJSON()).to.deep.eq({type: "object"});
    expect(string().toJSON()).to.deep.eq({type: "string"});
    expect(number().toJSON()).to.deep.eq({type: "number"});
    expect(integer().toJSON()).to.deep.eq({
      multipleOf: 1,
      type: "integer"
    });
    expect(boolean().toJSON()).to.deep.eq({type: "boolean"});
    expect(date().toJSON()).to.deep.eq({
      format: "date",
      type: "string"
    });
    expect(datetime().toJSON()).to.deep.eq({
      format: "date-time",
      type: "string"
    });
    expect(time().toJSON()).to.deep.eq({
      format: "time",
      type: "string"
    });
    expect(email().toJSON()).to.deep.eq({
      format: "email",
      type: "string"
    });
    expect(email().toJSON()).to.deep.eq({
      format: "email",
      type: "string"
    });
    expect(uri().toJSON()).to.deep.eq({
      format: "uri",
      type: "string"
    });
    expect(url().toJSON()).to.deep.eq({
      format: "url",
      type: "string"
    });
    expect(set().toJSON()).to.deep.eq({
      type: "array",
      uniqueItems: true
    });
    expect(map().toJSON()).to.deep.eq({
      additionalProperties: true,
      type: "object"
    });
    expect(array().toJSON()).to.deep.eq({type: "array"});
    expect(any().toJSON()).to.deep.eq({
      type: ["integer", "number", "string", "boolean", "array", "object", "null"]
    });

    expect(anyOf(string(), number()).toJSON()).to.deep.eq({
      anyOf: [{type: "string"}, {type: "number"}]
    });

    expect(allOf(string(), number()).toJSON()).to.deep.eq({
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
        stack: array().items(string()).description("The stack trace (only in development mode)")
      });

    expect(ExceptionSchema.toJSON()).to.deep.eq({
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
              type: "string"
            },
            name: {
              description: "The error name",
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
          type: "string"
        },
        name: {
          description: "The error name",
          type: "string"
        },
        stack: {
          description: "The stack trace (only in development mode)",
          items: {
            type: "string"
          },
          type: "array"
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
});
