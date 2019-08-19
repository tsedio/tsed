import {expect} from "chai";
import {ParamMetadata, ValidationService} from "../../../src/mvc";

describe("ValidationService", () => {
  class Test {
  }

  it("should return true", () => {
    return expect(new ValidationService().validate({},
      new ParamMetadata({
        target: Test,
        propertyKey: "method",
        index: 0
      }))).to.be.true;
  });
});
