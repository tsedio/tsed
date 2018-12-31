import {expect} from "chai";
import {ParamMetadata, ValidationService} from "../../../src/filters";

describe("ValidationService", () => {
  class Test {
  }

  it("should return true", () => {
    return expect(new ValidationService().validate({}, new ParamMetadata(Test, "test"))).to.be.true;
  });
});
