import {RequiredValidationError} from "@tsed/common";

describe("RequiredValidationError", () => {
  it("should have a message", () => {
    const error = RequiredValidationError.from({
      paramType: "name",
      expression: "expression"
    } as any);
    expect(error.message).toEqual("It should have required parameter 'expression'");
    expect(error.name).toEqual("REQUIRED_VALIDATION_ERROR");
    expect(JSON.parse(JSON.stringify(error))).toEqual({
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
