import {expect} from "chai";
import {ParamRegistry, ParamTypes, Req} from "../../../../src/mvc";

describe("@Req", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@Req() arg: Req) {
      }
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.REQUEST);
  });
});
