import {ParamValidationError} from "./ParamValidationError.js";
import {RequiredValidationError} from "./RequiredValidationError.js";
import {ValidationError} from "./ValidationError.js";

describe("ParseExpressionError", () => {
  it("should return error without transformation", () => {
    expect(ParamValidationError.from({} as any, new Error("error")).message).toEqual("error");
  });
  it("should return error", () => {
    const validationError = new ValidationError("message");

    const error = ParamValidationError.from(
      {
        paramType: "name",
        expression: "expression"
      } as any,
      validationError
    );
    expect(error.message).toEqual('Bad request on parameter "request.name.expression".\nmessage');
    expect(error.name).toEqual("PARAM_VALIDATION_ERROR");
    expect(error.dataPath).toEqual("expression");
    expect(error.requestType).toEqual("name");
    expect({
      name: error.name,
      status: error.status,
      headers: error.headers,
      type: error.type,
      message: error.message,
      dataPath: error.dataPath,
      requestType: error.requestType,
      origin: {
        name: error.origin.name,
        status: error.origin.status,
        headers: error.origin.headers,
        type: error.origin.type,
        message: error.origin.message,
        errors: error.origin.errors
      }
    }).toEqual({
      dataPath: "expression",
      headers: {},
      name: "PARAM_VALIDATION_ERROR",
      requestType: "name",
      status: 400,
      type: "HTTP_EXCEPTION",
      message: 'Bad request on parameter "request.name.expression".\nmessage',
      origin: {
        errors: [],
        headers: {},
        message: "message",
        name: "VALIDATION_ERROR",
        status: 400,
        type: "HTTP_EXCEPTION"
      }
    });
  });
  it("should throw error from origin error (RequiredValidationError)", () => {
    const metadata = {
      paramType: "name",
      expression: "expression"
    } as any;
    const origin = RequiredValidationError.from(metadata);

    const error = ParamValidationError.from(metadata, origin);
    expect(error.message).toEqual("Bad request on parameter \"request.name.expression\".\nIt should have required parameter 'expression'");
    expect(error.dataPath).toEqual("expression");
    expect(error.requestType).toEqual("name");

    expect({
      ...error,
      message: error.message,
      origin: {
        ...error.origin,
        message: error.origin.message
      }
    }).toEqual({
      dataPath: "expression",
      headers: {},
      name: "PARAM_VALIDATION_ERROR",
      message: "Bad request on parameter \"request.name.expression\".\nIt should have required parameter 'expression'",
      origin: {
        errors: [
          {
            requestPath: "name",
            dataPath: ".expression",
            keyword: "required",
            message: "It should have required parameter 'expression'",
            modelName: "name",
            params: {
              missingProperty: "expression"
            },
            schemaPath: "#/required"
          }
        ],
        headers: {},
        name: "REQUIRED_VALIDATION_ERROR",
        message: "It should have required parameter 'expression'",
        status: 400,
        type: "HTTP_EXCEPTION"
      },
      requestType: "name",
      status: 400,
      type: "HTTP_EXCEPTION"
    });
  });
  it("should throw error from origin error (ValidationError)", () => {
    const metadata = {
      paramType: "name",
      expression: "expression"
    } as any;
    const origin = new ValidationError("It should have 1 item", [
      {
        dataPath: "hello"
      }
    ]);

    const error = ParamValidationError.from(metadata, origin);
    expect(error.message).toEqual('Bad request on parameter "request.name.expression".\nIt should have 1 item');
    expect(error.dataPath).toEqual("expression");
    expect(error.requestType).toEqual("name");

    expect({
      ...error,
      message: error.message,
      origin: {
        ...error.origin,
        message: error.origin.message
      }
    }).toEqual({
      dataPath: "expression",
      headers: {},
      name: "PARAM_VALIDATION_ERROR",
      origin: {
        errors: [
          {
            requestPath: "name",
            dataPath: "hello"
          }
        ],
        headers: {},
        message: "It should have 1 item",
        name: "VALIDATION_ERROR",
        status: 400,
        type: "HTTP_EXCEPTION"
      },
      message: 'Bad request on parameter "request.name.expression".\nIt should have 1 item',
      requestType: "name",
      status: 400,
      type: "HTTP_EXCEPTION"
    });
  });
});
