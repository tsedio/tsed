import {RequiredValidationError} from "@tsed/common";
import {expect} from "chai";

describe("RequiredValidationError", () => {
  it("should have a message", () => {
    const error = RequiredValidationError.from({
      paramType: "name",
      expression: "expression"
    } as any);
    expect(error.message).to.equal("It should have required parameter 'expression'");
    expect(error.name).to.equal("REQUIRED_VALIDATION_ERROR");
    expect(JSON.parse(JSON.stringify(error))).to.deep.equal({
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
