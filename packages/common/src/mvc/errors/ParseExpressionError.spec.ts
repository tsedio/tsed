import {expect} from "chai";
import {ParseExpressionError} from "../../../src/mvc";

describe("ParseExpressionError", () => {
  before(() => {
    this.errorInstance = new ParseExpressionError("name", "expression", {message: "message"});
  });

  after(() => {
    delete this.errorInstance;
  });

  it("should have a message", () => {
    expect(this.errorInstance.message).to.equal("Bad request on parameter \"request.name.expression\".\nmessage");
  });

  it("should have a name", () => {
    expect(this.errorInstance.name).to.equal("BAD_REQUEST");
  });

  it("should have a dataPath", () => {
    expect(this.errorInstance.dataPath).to.equal("expression");
  });

  it("should have a service", () => {
    expect(this.errorInstance.requestType).to.equal("name");
  });

  it("should be used with JSON.stringify()", () => {
    expect(JSON.parse(JSON.stringify(this.errorInstance))).to.deep.equal({
      dataPath: "expression",
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
