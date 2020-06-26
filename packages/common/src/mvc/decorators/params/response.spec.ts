import {expect} from "chai";
import {ParamRegistry, ParamTypes, Res} from "../../../../src/mvc";

describe("@Res", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@Res() arg: Res) {
      }
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.RESPONSE);
  });
});
