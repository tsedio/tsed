import {RequiredValidationError} from "./RequiredValidationError.js";

describe("RequiredValidationError", () => {
  it("should have a message", () => {
    const error = RequiredValidationError.from({
      paramType: "name",
      expression: "expression"
    } as any);
    expect(error.message).toEqual("It should have required parameter 'expression'");
    expect(error.name).toEqual("REQUIRED_VALIDATION_ERROR");
    expect({
      name: error.name,
      status: error.status,
      headers: error.headers,
      type: error.type,
      message: error.message,
      errors: [
        {
          dataPath: error.errors[0].dataPath,
          keyword: error.errors[0].keyword,
          message: error.errors[0].message,
          modelName: error.errors[0].modelName,
          params: {
            missingProperty: error.errors[0].params.missingProperty
          },
          schemaPath: error.errors[0].schemaPath
        }
      ]
    }).toEqual({
      name: "REQUIRED_VALIDATION_ERROR",
      status: 400,
      headers: {},
      type: "HTTP_EXCEPTION",
      message: "It should have required parameter 'expression'",
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
      ]
    });
  });
});
