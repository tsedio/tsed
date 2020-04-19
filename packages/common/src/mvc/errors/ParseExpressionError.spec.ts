import {expect} from "chai";
import {ParseExpressionError} from "../../../src/mvc";

describe("ParseExpressionError", () => {
  before(() => {});

  it("should return error", () => {
    const errorInstance = new ParseExpressionError("name", "expression", {message: "message"});
    expect(errorInstance.message).to.equal("Bad request on parameter \"request.name.expression\".\nmessage");
    expect(errorInstance.name).to.equal("BAD_REQUEST");
    expect(errorInstance.dataPath).to.equal("expression");
    expect(errorInstance.requestType).to.equal("name");
    expect(JSON.parse(JSON.stringify(errorInstance))).to.deep.equal({
      dataPath: "expression",
      headers: {},
      errorMessage: "Bad request on parameter \"request.name.expression\".\nmessage",
      name: "BAD_REQUEST",
      requestType: "name",
      status: 400,
      type: "HTTP_EXCEPTION",
      origin: {
        message: "message"
      }
    });
  });
});
