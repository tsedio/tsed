import {expect} from "chai";
import {RequiredParamError} from "../../../src/mvc";

describe("RequiredParamError", () => {
  it("should have a message", () => {
    const errorInstance = new RequiredParamError("name", "expression");
    expect(errorInstance.message).to.equal("Bad request, parameter \"request.name.expression\" is required.");
    expect(errorInstance.name).to.equal("BAD_REQUEST");
    expect(JSON.parse(JSON.stringify(errorInstance))).to.deep.equal({
      name: "BAD_REQUEST",
      status: 400,
      headers: {},
      type: "HTTP_EXCEPTION",
      errors: [
        {
          dataPath: "",
          keyword: "required",
          message: "should have required param 'expression'",
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
