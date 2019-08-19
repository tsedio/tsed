import {expect} from "chai";
import {RequiredParamError} from "../../../src/mvc";

describe("RequiredParamError", () => {
  before(() => {
    this.errorInstance = new RequiredParamError("name", "expression");
  });

  after(() => {
    delete this.errorInstance;
  });

  it("should have a message", () => {
    expect(this.errorInstance.message).to.equal("Bad request, parameter \"request.name.expression\" is required.");
  });

  it("should have a name", () => {
    expect(this.errorInstance.name).to.equal("BAD_REQUEST");
  });

  it("should be used with JSON.stringify()", () => {
    expect(JSON.parse(JSON.stringify(this.errorInstance))).to.deep.equal({
      name: "BAD_REQUEST",
      status: 400,
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
