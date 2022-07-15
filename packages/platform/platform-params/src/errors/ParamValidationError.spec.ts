import {RequiredValidationError, ValidationError} from "@tsed/common";
import {expect} from "chai";
import {ParamValidationError} from "./ParamValidationError";

describe("ParseExpressionError", () => {
  it("should return error without transformation", () => {
    expect(ParamValidationError.from({} as any, new Error("error")).message).to.eq("error");
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
    expect(error.message).to.equal('Bad request on parameter "request.name.expression".\nmessage');
    expect(error.name).to.equal("PARAM_VALIDATION_ERROR");
    expect(error.dataPath).to.equal("expression");
    expect(error.requestType).to.equal("name");
    expect(JSON.parse(JSON.stringify(error))).to.deep.equal({
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
    expect(error.message).to.equal("Bad request on parameter \"request.name.expression\".\nIt should have required parameter 'expression'");
    expect(error.dataPath).to.equal("expression");
    expect(error.requestType).to.equal("name");

    expect(JSON.parse(JSON.stringify(error))).to.deep.equal({
      dataPath: "expression",
      headers: {},
      name: "PARAM_VALIDATION_ERROR",
      message: "Bad request on parameter \"request.name.expression\".\nIt should have required parameter 'expression'",
      origin: {
        errors: [
          {
            dataPath: "",
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
    expect(error.message).to.equal('Bad request on parameter "request.name.expression".\nIt should have 1 item');
    expect(error.dataPath).to.equal("expression");
    expect(error.requestType).to.equal("name");

    expect(JSON.parse(JSON.stringify(error))).to.deep.equal({
      dataPath: "expression",
      headers: {},
      name: "PARAM_VALIDATION_ERROR",
      origin: {
        errors: [
          {
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
