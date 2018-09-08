import {ParamMetadata, ValidationService} from "../../../../packages/common/src/filters";
import {expect} from "../../../tools";

describe("ValidationService", () => {
  class Test {}

  it("should return true", () => {
    expect(new ValidationService().validate({}, new ParamMetadata(Test, "test"))).to.be.true;
  });
});
