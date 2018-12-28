import {ParamMetadata, ValidationService} from "../../../../packages/common/src/filters";
import {expect} from "chai";

describe("ValidationService", () => {
  class Test {}

  it("should return true", () => {
    expect(new ValidationService().validate({}, new ParamMetadata(Test, "test"))).to.be.true;
  });
});
